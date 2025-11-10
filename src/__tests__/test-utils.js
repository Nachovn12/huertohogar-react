// --- 1. Mocks de Jasmine (Reemplazando Jest) ---

// Definimos fn para reemplazar jest.fn()
window.fn = jasmine.createSpy;

// --- 2. Implementación de Matchers de Jest-DOM para Jasmine ---

beforeAll(function() {
    // toHaveValue (Necesario para tu prueba de Login)
    jasmine.addMatchers({
        toHaveValue: function(util, customEqualityTesters) {
            return {
                compare: function(actual, expected) {
                    const value = actual.value;
                    const pass = util.equals(value, expected, customEqualityTesters);
                    return {
                        pass: pass,
                        message: 'Expected element to have value: ' + expected
                    };
                }
            };
        }
    });

    // toBeInTheDocument (Necesario para el 90% de tus tests)
    jasmine.addMatchers({
        toBeInTheDocument: function(util, customEqualityTesters) {
            return {
                compare: function(actual) {
                    const pass = actual && actual.ownerDocument && actual.ownerDocument.body.contains(actual);
                    return {
                        pass: pass,
                        message: 'Expected element to be in the document'
                    };
                }
            };
        }
    });

    // toBeDisabled (Necesario para ProductCard)
    jasmine.addMatchers({
        toBeDisabled: function() {
            return {
                compare: function(actual) {
                    const pass = actual.hasAttribute('disabled');
                    return { pass: pass };
                }
            };
        }
    });
});