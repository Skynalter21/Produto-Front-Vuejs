import { http } from './configuracao'

export default { 

    listar:() => {

        return http.get('cidades')
    },




}