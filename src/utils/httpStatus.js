const HttpStatus = {
  OK: 200, // Requisição bem-sucedida
  CREATED: 201, // Recurso criado com sucesso
  NO_CONTENT: 204, // Sem conteúdo na resposta
  BAD_REQUEST: 400, // Requisição inválida
  UNAUTHORIZED: 401, // Não autenticado
  FORBIDDEN: 403, // Acesso não permitido
  NOT_FOUND: 404, // Recurso não encontrado
  CONFLICT: 409, // Conflito no estado do recurso
  INTERNAL_SERVER_ERROR: 500, // Erro interno no servidor
};

export default HttpStatus;
