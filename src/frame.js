// src/simpleJSX.js
/**
 * Crea un elemento virtual (vNode) que representa un nodo del DOM.
 * @param {string} type - El tipo de elemento HTML (ej. 'div', 'span').
 * @param {Object} [props={}] - Propiedades/atributos del elemento.
 * @param {...any} children - Hijos del elemento (pueden ser texto u otros vNodes).
 * @returns {Object} Un objeto que representa el vNode.
 */
export const createElement = (type, props = {}, ...children) => {
    return { type, props: { ...props, children } };
};

/**
 * Renderiza un vNode en el DOM real.
 * @param {Object} vNode - Nodo virtual creado con createElement.
 * @param {HTMLElement} container - Contenedor del DOM donde se montará el elemento.
 */
export const render = (vNode, container) => {
    container.innerHTML = ''; // Limpia el contenido previo
    container.appendChild(renderElement(vNode)); // Agrega el nuevo contenido
};

/**
 * Convierte un vNode en un elemento DOM real.
 * @param {Object} vNode - Nodo virtual.
 * @returns {HTMLElement} Nodo del DOM real.
 */
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

/**
 * Crea una tienda de estado centralizado para gestionar el estado de la aplicación.
 * Sigue el patrón FLUX.
 * @param {Function} reducer - Función reductora para manejar cambios en el estado.
 * @returns {Object} Objeto con los métodos getState, dispatch y subscribe.
 */
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
            return () => listeners.filter(l => l !== listener); // Permite desuscribirse
        }
    };
};
