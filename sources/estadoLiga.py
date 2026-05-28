import json
import os
import re
import urllib.error
import urllib.request
from collections import defaultdict
from pathlib import Path

try:
    import matplotlib.pyplot as plt
except ImportError:
    plt = None


def division_sort_key(name):
    match = re.search(r"\d+", name)
    return int(match.group()) if match else 999


base_dir = Path(__file__).resolve().parent
data_file = base_dir / "clasificacion.json"
api_base = "https://club-padel-api-12f28391bbbd.herokuapp.com"
liga_id = os.getenv("LIGA_ID", "6553")
charts_dir = base_dir / "graficos_liga"
division_charts_dir = charts_dir / "divisiones"
excluded_divisions = {"Retirados"}

data = None
try:
    url = f"{api_base}/clasificaciones?ligaId={liga_id}"
    req = urllib.request.Request(
        url,
        headers={
            "Authorization": "Basic Y2x1YnBhZGVsdXNlcjpjbHVicGFkZWxwYXNz ",
            "Content-Type": "application/json",
        },
    )
    with urllib.request.urlopen(req, timeout=20) as resp:
        payload = resp.read().decode("utf-8")
        data = json.loads(payload)
except (urllib.error.URLError, urllib.error.HTTPError, json.JSONDecodeError) as exc:
    print(f"No se pudo obtener datos del API ({exc}). Usando {data_file}...")

if data is None:
    with data_file.open("r", encoding="utf-8") as f:
        data = json.load(f)

data = [
    x
    for x in data
    if (x.get("division") or {}).get("nombre", "Sin división") not in excluded_divisions
]

total_jugados = sum(x.get("partidosJugados", 0) for x in data)
total_no_jugados = sum(x.get("noJugados", 0) for x in data)
total = total_jugados + total_no_jugados

pct_j = (total_jugados / total * 100) if total else 0
pct_nj = (total_no_jugados / total * 100) if total else 0

print("=== RESUMEN GENERAL ===")
print(f"Parejas: {len(data)}")
print(f"Jugados: {total_jugados}")
print(f"No jugados: {total_no_jugados}")
print(f"Total: {total}")
print(f"% Jugados: {pct_j:.2f}%")
print(f"% No jugados: {pct_nj:.2f}%")

by_div = defaultdict(lambda: {"jugados": 0, "no": 0, "parejas": 0})
for x in data:
    div = (x.get("division") or {}).get("nombre", "Sin división")
    by_div[div]["jugados"] += x.get("partidosJugados", 0)
    by_div[div]["no"] += x.get("noJugados", 0)
    by_div[div]["parejas"] += 1

divisiones = sorted(by_div.keys(), key=division_sort_key)

print("\n=== POR DIVISIÓN ===")
for div in divisiones:
    v = by_div[div]
    t = v["jugados"] + v["no"]
    pj = (v["jugados"] * 100 / t) if t else 0
    pnj = (v["no"] * 100 / t) if t else 0
    print(
        f"{div}: parejas={v['parejas']}, jugados={v['jugados']} ({pj:.2f}%), "
        f"no jugados={v['no']} ({pnj:.2f}%)"
    )

if not plt:
    print("\nNo se generaron gráficos porque falta matplotlib.")
    print("Instala la dependencia con: pip install matplotlib")
    raise SystemExit(0)

charts_dir.mkdir(parents=True, exist_ok=True)
division_charts_dir.mkdir(parents=True, exist_ok=True)

# Gráfico general (dona)
fig, ax = plt.subplots(figsize=(8, 6))
values = [total_jugados, total_no_jugados]
labels = ["Jugados", "No jugados"]
colors = ["#2e7d32", "#c62828"]

ax.pie(
    values,
    labels=labels,
    autopct="%1.1f%%",
    startangle=90,
    colors=colors,
    wedgeprops={"width": 0.45, "edgecolor": "white"},
)
ax.text(
    0,
    0,
    f"Jugados\n{total_jugados}",
    ha="center",
    va="center",
    fontsize=14,
    fontweight="bold",
)
ax.set_title("Estado general de partidos")
general_chart = charts_dir / "grafico_general.png"
fig.savefig(general_chart, dpi=150, bbox_inches="tight")
plt.close(fig)

# Gráfico por división (barras apiladas)
jugados_vals = [by_div[d]["jugados"] for d in divisiones]
no_vals = [by_div[d]["no"] for d in divisiones]

fig, ax = plt.subplots(figsize=(12, 6))
ax.bar(divisiones, jugados_vals, label="Jugados", color="#2e7d32")
ax.bar(divisiones, no_vals, bottom=jugados_vals, label="No jugados", color="#c62828")
ax.set_title("Estado de partidos por división")
ax.set_xlabel("División")
ax.set_ylabel("Partidos")
ax.legend()
ax.tick_params(axis="x", rotation=30)
for idx, jugados_div in enumerate(jugados_vals):
    ax.text(
        idx,
        jugados_div,
        f"{jugados_div}",
        ha="center",
        va="bottom",
        fontsize=9,
        fontweight="bold",
    )
fig.tight_layout()
division_chart = charts_dir / "grafico_por_division.png"
fig.savefig(division_chart, dpi=150)
plt.close(fig)

# Gráficos individuales por división
for div in divisiones:
    v = by_div[div]
    values = [v["jugados"], v["no"]]
    fig, ax = plt.subplots(figsize=(6, 5))
    ax.pie(values, labels=labels, autopct="%1.1f%%", startangle=90, colors=colors)
    ax.set_title(f"{div} ({v['parejas']} parejas)")
    filename = re.sub(r"[^\w\-]+", "_", div, flags=re.UNICODE).strip("_")
    fig.savefig(division_charts_dir / f"{filename}.png", dpi=150, bbox_inches="tight")
    plt.close(fig)

print("\nGráficos generados:")
print(f"- {general_chart}")
print(f"- {division_chart}")
print(f"- {division_charts_dir} (gráficos individuales por división)")
