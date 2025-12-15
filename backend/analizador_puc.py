import json
import os

class AnalizadorPUC:
    def __init__(self):
        base_dir = os.path.dirname(os.path.abspath(__file__))
        self.ruta_privado = os.path.join(base_dir, 'diccionarios', 'puc_privado.json')
        # Cargar diccionario
        self.puc_privado = self._cargar_y_limpiar(self.ruta_privado)

    def _cargar_y_limpiar(self, ruta):
        diccionario_limpio = {}
        try:
            with open(ruta, 'r', encoding='utf-8') as f:
                datos = json.load(f)
                # Limpiamos espacios y aseguramos que sean strings
                for k, v in datos.items():
                    diccionario_limpio[str(k).strip()] = str(v).strip()
            return diccionario_limpio
        except Exception:
            return {}

    def procesar_ingreso_cuenta(self, codigo_usuario, nombre_usuario, tipo_puc='privado'):
        codigo_usuario = str(codigo_usuario).strip()
        nombre_usuario = str(nombre_usuario).strip()
        diccionario = self.puc_privado
        
        cuentas_para_insertar = []
        
        # Niveles estandar PUC Colombiano
        niveles = [1, 2, 4, 6, 8, 10]
        longitud = len(codigo_usuario)
        
        exito_total = True

        # BARRIDO JERÁRQUICO (De menor a mayor nivel)
        # Esto garantiza el orden: Primero Clase (1), luego Grupo (2), etc.
        for nivel in niveles:
            if nivel <= longitud:
                codigo_parcial = codigo_usuario[:nivel]
                
                # Caso A: Es la cuenta que el usuario está creando
                if codigo_parcial == codigo_usuario:
                    cuentas_para_insertar.append({
                        "codigo": codigo_parcial,
                        "nombre": nombre_usuario, # Nombre del usuario
                        "nivel": nivel,
                        "tipo": "Detalle" if nivel > 4 else "Titulo" # Lógica simple de tipo
                    })
                
                # Caso B: Es un Padre/Abuelo
                else:
                    nombre_padre = diccionario.get(codigo_parcial)
                    
                    if nombre_padre:
                        cuentas_para_insertar.append({
                            "codigo": codigo_parcial,
                            "nombre": nombre_padre, # Nombre OFICIAL del diccionario
                            "nivel": nivel,
                            "tipo": "Titulo"
                        })
                    else:
                        # Si no existe en el diccionario, marcamos error pero NO inventamos nombre
                        cuentas_para_insertar.append({
                            "codigo": codigo_parcial,
                            "nombre": "⚠️ NOMBRE FALTANTE EN PUC",
                            "nivel": nivel,
                            "tipo": "Titulo"
                        })
                        exito_total = False

        return {
            "exito": exito_total,
            "datos": cuentas_para_insertar
        }