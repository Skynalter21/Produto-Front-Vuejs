import { http } from './configuracao'

export default{

    listar:() => {

        return http.get('produtos')
    },

    salvar:(produto) => {
        return http.post('produto', produto)
    },

    atualizar:(produto) => {
        return http.put('produto',produto)

    },

    apagar:(produto) => {
        return http.delete(`produto/${produto.id}`)
    },

    procurarNome:(filtroNome) => {
        return http.get(`produto/procura/${filtroNome}`)
    }
    
}