from flask import Flask, request, jsonify
from analizador_puc import AnalizadorPUC # Importamos tu cerebro
import psycopg2 # Librería para conectar a PostgreSQL

app = Flask(__name__)

# Instanciamos el analizador una sola vez al arrancar
cerebro_contable = AnalizadorPUC()

# Configuración de Base de Datos (Pon tus datos reales aquí)
DB_CONFIG = {
    "dbname": "tu_base_datos",
    "user": "postgres",
    "password": "tu_password",
    "host": "localhost",
    "port": "5432"
}

@app.route('/api/crear-cuenta', methods=['POST'])
def endpoint_crear_cuenta():
    # 1. RECIBIR DATOS DEL MODAL
    datos_entrada = request.json # Llega { "codigo": "112505", "nombre": "ROTATORIOS", "tipo": "privado" }
    
    codigo_usuario = datos_entrada.get('codigo')
    nombre_usuario = datos_entrada.get('nombre')
    tipo_puc = datos_entrada.get('tipo', 'privado')

    # 2. USAR EL CEREBRO (Tu script analizador)
    # Esto genera la lista mágica: [Cuenta 11, Cuenta 1125, Cuenta 112505]
    resultado_analisis = cerebro_contable.procesar_ingreso_cuenta(codigo_usuario, nombre_usuario, tipo_puc)

    if not resultado_analisis['exito']:
        # Si el analizador dice que falta información en el diccionario, avisamos al frontend
        return jsonify({"error": "No se encontraron padres en el diccionario. Actualice el PUC."}), 400

    lista_para_insertar = resultado_analisis['datos']

    # 3. INSERTAR EN POSTGRESQL (Bucle automático)
    try:
        conn = psycopg2.connect(**DB_CONFIG)
        cursor = conn.cursor()

        cuentas_creadas = 0
        
        # RECORREMOS LA LISTA QUE GENERÓ EL ANALIZADOR
        for cuenta in lista_para_insertar:
            # Usamos ON CONFLICT DO NOTHING para que si el padre ya existe, no de error, solo lo salte.
            sql = """
                INSERT INTO contabilidad.plancuentas (codigo_cuenta, nombre_cuenta, nivel, imputable, anio)
                VALUES (%s, %s, %s, %s, 2025)
                ON CONFLICT (codigo_cuenta) DO NOTHING;
            """
            
            # Determinamos si es imputable (Nivel 6 u 8 suele ser imputable 'S', padres 'N')
            es_imputable = 'S' if cuenta['nivel'] >= 6 else 'N'
            
            cursor.execute(sql, (
                cuenta['codigo'], 
                cuenta['nombre'], 
                cuenta['nivel'], 
                es_imputable
            ))
            
            # Verificamos si realmente insertó algo (rowcount > 0)
            if cursor.rowcount > 0:
                cuentas_creadas += 1

        conn.commit()
        cursor.close()
        conn.close()

        # 4. RESPONDER AL MODAL
        return jsonify({
            "mensaje": "Proceso exitoso",
            "cuentas_insertadas": cuentas_creadas,
            "detalle": lista_para_insertar
        }), 200

    except Exception as e:
        return jsonify({"error": f"Error en base de datos: {str(e)}"}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)