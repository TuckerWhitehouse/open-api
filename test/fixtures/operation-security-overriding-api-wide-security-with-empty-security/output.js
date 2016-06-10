export default createApi;
function createApi(options) {
  const basePath = '/v2';
  const endpoint = options.endpoint || 'http://petstore.swagger.io';
  const cors = !!options.cors;
  const mode = cors ? 'cors' : 'basic';
  const securityHandlers = options.securityHandlers || {};
  const handleSecurity = (security, headers, params, operationId) => {
    for (let i = 0, ilen = security.length; i < ilen; i++) {
      let scheme = security[i];
      let schemeParts = Object.keys(scheme);
      for (let j = 0, jlen = schemeParts.length; j < jlen; j++) {
        let schemePart = schemeParts[j];
        let fulfilsSecurityRequirements = securityHandlers[schemePart](
            headers, params, schemePart);
        if (fulfilsSecurityRequirements) {
          return;
        }

      }
    }
    throw new Error('No security scheme was fulfilled by the provided securityHandlers for operation ' + operationId);
  };
  const ensureRequiredSecurityHandlersExist = () => {
    let requiredSecurityHandlers = ['api_wide_auth'];
    for (let i = 0, ilen = requiredSecurityHandlers.length; i < ilen; i++) {
      let requiredSecurityHandler = requiredSecurityHandlers[i];
      if (typeof securityHandlers[requiredSecurityHandler] !== 'function') {
        throw new Error('Expected to see a security handler for scheme "' +
            requiredSecurityHandler + '" in options.securityHandlers');
      }
    }
  };
  ensureRequiredSecurityHandlersExist();
  const buildQuery = (obj) => {
    return Object.keys(obj).map((key) => {
      const value = obj[key];
      if (value === undefined) {
        return '';
      }
      if (value === null) {
        return key;
      }
      if (Array.isArray(value)) {
        if (value.length) {
          return key + '=' + value.map(encodeURIComponent).join('&' + key + '=');
        } else {
          return '';
        }
      } else {
        return key + '=' + encodeURIComponent(value);
      }
    }).join('&');
  };
  return {
    addPet(params) {
      let headers = {
        'content-type': 'application/json',

      };
      return fetch(endpoint + basePath + '/pet'
        , {
          method: 'POST',
          headers,
          mode,
          body: JSON.stringify(params['body']),

        });
    },

  };
}
