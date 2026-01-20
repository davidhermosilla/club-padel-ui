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

# Leer hoja 'ListadoPreLiga' primero, si no existe usar 'Parejas'
try:
    df = pd.read_excel(xls, sheet_name='ListadoPreLiga', header=None)
    # La hoja ListadoPreLiga tiene estructura diferente, buscar fila de encabezado
    header_row = None
    for idx, row in df.iterrows():
        if any('pareja' in str(val).lower() for val in row if pd.notna(val)):
            header_row = idx
            break
    
    if header_row is not None:
        df = pd.read_excel(xls, sheet_name='ListadoPreLiga', header=header_row)
    else:
        # Si no hay encabezado claro, intentar con Parejas
        df = pd.read_excel(xls, sheet_name='Parejas')
except Exception:
    # Fallback a hoja Parejas
    df = pd.read_excel(xls, sheet_name='Parejas')

cols = {c.lower(): c for c in df.columns}

# Buscar columna ListadoPreLiga o Pareja
col_listado = None
col_div = None

for k, v in cols.items():
    if 'listadoprelig' in k.replace(' ', '').replace('_', '').lower() or 'pareja' in k.lower():
        col_listado = v
    if 'div' in k and 'listado' not in k.lower() and 'pareja' not in k.lower():
        col_div = v

if col_listado is None:
    raise SystemExit('No se encontró la columna ListadoPreLiga o Pareja en el Excel')

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

# Función para parsear la columna ListadoPreLiga
def parse_pareja(listado_text):
    """
    Parsea texto como 'Jugador1 / Jugador2' o 'Jugador1 - Jugador2'
    Retorna (jugador1, jugador2) o None si no es válido
    """
    if pd.isna(listado_text):
        return None
    
    text = str(listado_text).strip()
    if not text or text == 'nan':
        return None
    
    # Intentar separadores comunes
    separadores = [' / ', '/', ' - ', '-', ' | ', '|']
    for sep in separadores:
        if sep in text:
            parts = text.split(sep, 1)
            if len(parts) == 2:
                j1 = parts[0].strip()
                j2 = parts[1].strip()
                if j1 and j2:
                    return (j1, j2)
    
    return None

# Preparar listas
parejas = []
for _, row in df.iterrows():
    pareja = parse_pareja(row[col_listado])
    if pareja:
        j1, j2 = pareja
        div = fmt_div(row[col_div]) if col_div else ''
        parejas.append((div, j1, j2))

if not parejas:
    raise SystemExit('No se encontraron parejas válidas en la columna Pareja/ListadoPreLiga')

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

print(f'✓ Generados {len(parejas)} parejas desde columna "{col_listado}":')
print(f'  - {out1}')
print(f'  - {out2}')
