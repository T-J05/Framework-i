# Crear tu propio framework en JavaScript

## Conceptos clave

Antes de comenzar con el código, es importante entender algunos conceptos fundamentales:

### Estado (State)
El estado es el ciclo de vida de un componente. En términos simples, es un valor que un componente mantiene y puede cambiar sin afectar el renderizado de otros componentes. Solo el estado del componente que cambia se actualiza en la interfaz.

### Arquitectura Flux
Flux es un patrón de arquitectura unidireccional en el que los cambios de estado siguen un flujo en cuatro etapas:

1. **Vista:** Es la interfaz con la que interactúa el usuario.
2. **Acción:** Se genera cuando el usuario realiza una interacción.
3. **Dispatcher:** Recibe la acción y la comunica al store.
4. **Store:** Gestiona el estado y notifica a la vista para actualizarse.

Este flujo garantiza un control claro y estructurado sobre los cambios de estado.

---

## Implementación

### 1. Creación de elementos virtuales (vNodes)
Para crear una representación virtual de los elementos HTML, usamos la siguiente función:

```js
export const createElement = (type, props = {}, ...children) => {
    return { type, props: { ...props, children } };
};
```

Esta función recibe:
- `type`: El tipo de elemento (ej. `h1`, `div`).
- `props`: Atributos del elemento (ej. `{ id: "saludo1" }`).
- `children`: Contenido interno o elementos anidados.

---

### 2. Renderizado del vNode en el DOM
Para insertar el nodo virtual en el DOM real, definimos la función `render`:

```js
export const render = (vNode, container) => {
    container.innerHTML = ''; // Limpia el contenido previo
    container.appendChild(renderElement(vNode)); // Agrega el nuevo contenido
};
```

Esta función:
1. Limpia el contenido del contenedor.
2. Agrega el nuevo contenido generado por `renderElement`.

---

### 3. Conversión de vNodes en elementos reales
La función `renderElement` crea elementos del DOM a partir de vNodes:

```js
const renderElement = (vNode) => {
    if (typeof vNode === 'string') {
        return document.createTextNode(vNode); // Si es texto, crea un nodo de texto
    }

    const element = document.createElement(vNode.type); // Crea el elemento del tipo especificado

    // Asigna propiedades/atributos al elemento
    Object.entries(vNode.props || {}).forEach(([key, value]) => {
        if (key === 'children') {
            value.forEach(child => element.appendChild(renderElement(child))); // Renderiza hijos
        } else {
            element[key] = value; // Asigna otros atributos
        }
    });

    return element; // Devuelve el nodo del DOM creado
};
```

Explicación:
- Si el `vNode` es un string, crea un nodo de texto.
- Si es un objeto, crea un elemento del tipo especificado.
- Asigna atributos y propiedades.
- Si tiene hijos, los renderiza y los agrega al elemento.

---

### 4. Creación del Store (Gestor de Estado)
El store maneja el estado de la aplicación y notifica cambios a los componentes:

```js
export const createStore = (reducer) => {
    let state = reducer(undefined, { type: '__INIT__' }); // Estado inicial
    const listeners = []; // Lista de suscriptores

    return {
        /**
         * Obtiene el estado actual.
         * @returns {any} El estado actual de la tienda.
         */
        getState: () => state,

        /**
         * Despacha una acción para actualizar el estado.
         * @param {Object} action - Acción con tipo y payload.
         */
        dispatch: (action) => {
            state = reducer(state, action); // Calcula el nuevo estado
            listeners.forEach(listener => listener()); // Notifica a los suscriptores
        },

        /**
         * Agrega un suscriptor que será llamado en cada cambio de estado.
         * @param {Function} listener - Función suscriptora.
         */
        subscribe: (listener) => {
            listeners.push(listener);
            return () => {
                const index = listeners.indexOf(listener);
                if (index > -1) listeners.splice(index, 1);
            };
        }
    };
};
```

### Explicación:
- **Reducer**: Función que indica cómo debe cambiar el estado ante una acción.
- **`getState`**: Devuelve el estado actual.
- **`dispatch`**: Recibe una acción y actualiza el estado notificando a los suscriptores.
- **`subscribe`**: Permite que un componente escuche los cambios de estado y también permite desuscribirse.

---

## Conclusión
Este mini-framework proporciona un sistema básico para manejar el estado de la aplicación de manera estructurada y eficiente, similar a React con Redux. Al seguir una arquitectura unidireccional como Flux, evitamos la propagación descontrolada de cambios en el estado, manteniendo la aplicación predecible y modular.

¡Ahora puedes expandirlo agregando más funcionalidades como eventos, hooks o incluso un sistema de efectos secundarios! 🚀

