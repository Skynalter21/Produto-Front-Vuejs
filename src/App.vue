
<template>
  <div id="app">
    <nav>
      <div class="nav-wrapper blue darken-1">
        <a href="#" class="brand-logo center">Produtos API</a>
      </div>
    </nav>

    <div class="container">
      <ul>
        <li v-for="(erro,index) of erros" :key="index">
          campo
          <b>{{ erro.field }}</b>
          - {{ erro.defaultMessage }}
        </li>
      </ul>
      <form @submit.prevent="() => {}">
        <label>Nome</label>
        <input type="text" placeholder="Nome" v-model="produto.nome" />
        <label>Estoque</label>
        <input type="number" placeholder="QTD" v-model="produto.estoque" />
        <label>Valor</label>
        <input type="text" placeholder="Valor" v-model="produto.valor" />
        
        <label>Cidade</label>
        <div class="input-field col s12" style="padding-bottom: 30px">  
          <select style="display: block !important;" v-model="produto.idCidade">
            <option value="" disabled selected>Escolher cidade</option>
            <option v-for="cidade of cidades" :key="cidade.id" :value="cidade.id">
              {{ cidade.nome }}
            </option>
          </select>
        </div>

        <button class="waves-effect waves-light btn-small pl-10" @click="salvar">
          Salvar
          <i class="material-icons left">send</i>
        </button>
        <button class="waves-effect waves-light btn-small pl-10" @click="listar">
          Listar Produtos
          <i class="material-icons left">list</i>
        </button>
        <button class="waves-effect waves-light btn-small pl-10 " @click="limpar">
          Limpar
          <i class="material-icons left">clear</i>
        </button>
      </form>

      <form @submit.prevent="procurarNome">
        <label>Pesquisar</label>
        <input type="text" placeholder="Nome" v-model="filtroNome" />
        <button class="waves-effect waves-light btn-small">
          Procurar
          <i class="material-icons left">search</i>
        </button>
      </form>

      <table v-show="produtos.length > 0">
        <thead>
          <tr>
            <th>NOME</th>
            <th>ESTOQUE</th>
            <th>VALOR</th>
            <th>CIDADE</th>
            <th>OPÇÕES</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="produto of produtos" :key="produto.id">
            <td>{{ produto.nome }}</td>
            <td>{{ produto.estoque }}</td>
            <td>{{ produto.valor }}</td>
            <td>{{ produto.cidade ? produto.cidade.nome : '' }}</td>
            <td>
              <button @click="editar(produto)" class="waves-effect btn-small blue darken-1">
                <i class="material-icons">create</i>
              </button>
              <button @click="remover(produto)" class="waves-effect btn-small red darken-1">
                <i class="material-icons">delete_sweep</i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>

import Produto from './services/produtos'
import Cidade from './services/cidades'

// ESLINT e Prettier

export default {

  data(){
    return{
      produto:{
        id:'',
        nome:'',
        estoque:'',
        valor:'',
        cidade: null,
        idCidade: ''
      },
      produtos: [],
      cidades: [],
      erros:[],
      filtroNome: '',
      selected: ''
    }
  },


  mounted(){

    this.listarCidades()
  },

  methods: {


    listarCidades(){
      Cidade.listar().then(resposta => {
        this.cidades = resposta.data
      })
    },
    listar(){
      Produto.listar().then(resposta => {
        this.produtos = resposta.data
      })
    },

    procurarNome(){
      if (!this.filtroNome) {
        alert("Informar filtro para pesquisa!")
        return
      }
      Produto.procurarNome(this.filtroNome)
        .then(({ data }) => {
          this.produtos = data
        })
    },

    limpar () {
      this.produtos = []
    },
    
    validar () {
      if (!this.produto.nome || !this.produto.valor || !this.produto.estoque ) return false
      return true
    },
    salvar (){
      if (this.validar()) {
        if (this.produto.idCidade) {
          this.produto.cidade = {
            id: this.produto.idCidade
          }
        }
        if(!this.produto.id){
          Produto.salvar(this.produto).then(() => {
            this.produto = {}
            alert('Informacao salva com sucesso!!')
            //this.listar()
            this.errors=[]
          }).catch(e=> {
            this.errors = e.response.data.errors
          })
        } else{
          Produto.atualizar(this.produto).then(() => {
            this.produto = {}
            alert('Informacao atualizada com sucesso!!')
            //this.listar()
            this.errors=[]
          }).catch(e=> {
            this.errors = e.response.data.errors
          })
        }
      } else {
        if (!this.produto.nome) alert("Insira o nome")
        else if (!this.produto.valor) alert("Insira o valor")
        else if (!this.produto.QTD) alert("Insira o Estoque")
      }
    },

    editar(produto){

      this.produto = produto

    },

    remover(produto){
      if(confirm("Deseja realmente apagar o produto?")) {
        Produto.apagar(produto).then(() => {
          this.listar()
          this.errors = []
        }).catch(e=>{
          this.errors = e.response.data.errors
        })
      }
    }

  }
  
}
</script>

<style>

.pl-10{
  margin-right: 10px;
}

</style>
