import pandas as pd
from pathlib import Path

src = Path(__file__).parent
# localizar el archivo Excel (acepta subcarpetas y distintos nombres que empiecen por 'Liga2026')
xls_candidates = list(src.rglob('Liga2026*.xlsx')) + list(src.rglob('*.xlsx'))
xls = None
for c in xls_candidates:
    # evitar el propio script si por algún motivo tiene extension xlsx (improbable)
    if c.is_file():
        xls = c
        break
if xls is None:
    raise SystemExit(f'No se encontró ningún archivo .xlsx en {src} (buscado Liga2026*.xlsx)')

# Leer hoja 'Parejas' intentando varias variantes de nombres de columna
df = pd.read_excel(xls, sheet_name='Parejas')
cols = {c.lower(): c for c in df.columns}

# Nombres esperados (flexible)
col_div = None
col_j1 = None
col_j2 = None
for k, v in cols.items():
    if 'div' in k:
        col_div = v
    if 'jugador1' in k or 'jugador 1' in k or 'jug1' in k:
        col_j1 = v
    if 'jugador2' in k or 'jugador 2' in k or 'jug2' in k:
        col_j2 = v

if col_j1 is None or col_j2 is None:
    raise SystemExit('No se encontraron columnas de jugadores en el Excel')

# Función para normalizar división a 'Xª División'
def fmt_div(d):
    if pd.isna(d):
        return ''
    if isinstance(d, (int,)):
        n = int(d)
        return f"{n}ª División"
    try:
        # si es float como 1.0
        if float(d).is_integer():
            return f"{int(float(d))}ª División"
    except Exception:
        pass
    s = str(d).strip()
    # si ya contiene 'ª' o 'División' respetar
    if 'ª' in s or 'División' in s:
        return s
    # intentar extraer número inicial
    parts = s.split()
    try:
        n = int(float(parts[0]))
        return f"{n}ª División"
    except Exception:
        return s

# Preparar listas
parejas = []
for _, row in df.iterrows():
    j1 = str(row[col_j1]).strip()
    j2 = str(row[col_j2]).strip()
    div = fmt_div(row[col_div]) if col_div else ''
    if j1 and j2:
        parejas.append((div, j1, j2))

# Escribir parejas_carga.txt (División|Jugador1|Jugador2)
out1 = src / 'parejas_carga.txt'
with out1.open('w', encoding='utf-8') as f:
    for div, j1, j2 in parejas:
        line = f"{div}|{j1}|{j2}\n" if div else f"|{j1}|{j2}\n"
        f.write(line)

# Escribir parejas_puntos.txt (Jugador1|Jugador2|0|0)
out2 = src / 'parejas_puntos.txt'
with out2.open('w', encoding='utf-8') as f:
    for _, j1, j2 in parejas:
        f.write(f"{j1}|{j2}|0|0\n")

print('Generados:', out1, out2)
