<template>
  <div class="pedidos">
    <v-alert
      style='position: fixed !important; z-index: 3;'
      v-model="alert.on"
      :color="alert.color"
      dark
    >
      {{ alert.text }}
    </v-alert>
    <v-dialog
      v-model="alert2.on"
      fullscreen
    >
      <v-card>
        <v-card-text>
          <div>
            {{ alert2.text }}
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="dialogConfirmar"
      fullscreen
    >
      <v-card>
        <v-card-title class="headline grey lighten-2">
          Seu pedido esta correto?
        </v-card-title>

        <v-data-table
          :headers="cabecalho"
          :items="revisao"
          dense
          disable-sort
          hide-default-footer
          class="elevation-0"
        ></v-data-table>

        <v-divider></v-divider>

        <v-card-actions style='position: fixed; left: 0; bottom: 0; width: 100%;'>
          <v-btn
            color="primary"

            @click="dialogConfirmar = false"
          >
            Revisar
          </v-btn>
          <v-spacer />
          <v-btn
            color="secondary"
            elevation="0"
            class='black--text'
            @click="finalizar"
          >
            Confirmar R$: {{ this.valorTotalRevisao }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-card elevation="0" v-if='loading'>
      <v-progress-linear
        striped
        indeterminate
        color="secondary"
      />
    </v-card>
    <v-container v-else>
      <v-card class="mt-5 justify-center" elevation="15">
        <v-card-text>
          <v-list-item-title class="headline mb-1 text-center">
            Faça o seu pedido aqui
          </v-list-item-title>
        </v-card-text>
        <v-row class="mx-1">
          <v-col cols="12">
            <v-text-field
              v-model="nome"
              label="Seu nome"
              required
              outlined
              hide-details
            ></v-text-field>
          </v-col>
          <v-col cols="12">
          <v-text-field
            v-model="telefone"
            label="Celular (Whats-App)"
            required
            hide-details
            outlined
            v-mask="'(##) ##### ####'"
          ></v-text-field>
          </v-col>
          <v-form
            v-model="formPedido"
            v-for="pedido in pedidos"
            :key="pedido.Nome"
            style="width: 100%"
          >
            <v-divider />
            <v-container>
              <v-row>
                <v-col cols="12">
                  <v-combobox
                    v-model="pedido.CodigoProduto"
                    :items="tipos"
                    item-text="Nome"
                    label="Produto"
                    hide-details
                    outlined
                    return-object
                  ></v-combobox>
                </v-col>
                <v-col cols="12">
                  <v-combobox
                    v-model="pedido.Quantidade"
                    :items="quantidade"
                    label="Quantidade"
                    suffix="KG(s)"
                    hide-details
                    outlined
                  ></v-combobox>
                </v-col>
                <v-col cols="12">
                  <v-text-field
                  autofocus
                    v-model="pedido.Descricao"
                    label="Observação"
                    required
                    hide-details
                    outlined
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-btn v-if='pedido.key >= 1 || pedidos.length > 1' class="mb-5 red--text" @click='removerProduto(pedido)' block elevation="0" color="secondary"
            >Remover esse item</v-btn
          >
            </v-container>
          </v-form>
          <v-btn class="mb-5" @click='maisProduto' block elevation="0" color="secondary"
            >Adicionar mais um item</v-btn
          >
        </v-row>
      </v-card>
      <v-btn class="mt-8" large @click='confirmar' block elevation="0" color="primary"
            >Fazer pedido</v-btn
          >
    </v-container>
  </div>
</template>

<script>
import Axios from 'axios'
import moment from 'moment'
export default {
  name: 'Pedidos',
  data () {
    return {
      revisao: [],
      valorTotalRevisao: 0,
      alert: {
        on: false,
        color: 'primary',
        text: 'Aviso!'
      },
      alert2: {
        on: false,
        text: 'Seu pedido feito com sucesso! aguarde até você receber uma mensagem para retirar seu pedido!'
      },
      dialogConfirmar: false,
      loading: false,
      nome: null,
      telefone: null,
      pedidos: [],
      quantidade: [],
      formPedido: null,
      tipos: [],
      cabecalho: [{
        text: 'Nome',
        align: 'start',
        value: 'Nome'
      },
      {
        text: 'Qnt (KG)',
        value: 'Quantidade'
      },
      {
        text: 'Total',
        value: 'Total'
      }]
    }
  },

  created () {
    this.alert2.on = false
    this.loading = true
    Axios.get(`http://pedidoapi.estanciasupermercados.com.br/api/Pedido/GetProdutosVenda?loja=${this.$route.params.loja}&secao=${this.$route.params.secao}`).then(resp => {
      resp.data.ResultObject.forEach(item => {
        const novoItem = {
          Nome: `${item.Descricao} - ${item.Corte} - R$: ${item.Valor}/KG`,
          CodigoProduto: item.CodigoProduto,
          Preco: item.Valor
        }
        this.tipos.push(novoItem)
      })
      this.loading = false
    })
    let numero = 0
    for (let i = 0; i < 200; i++) {
      numero = numero + 0.250
      this.quantidade.push(numero)
    }
    this.maisProduto()
  },

  methods: {

    maisProduto () {
      const novoProduto = {
        Quantidade: 0,
        CodigoProduto: null,
        Descricao: null
      }
      this.pedidos.push(novoProduto)
    },

    confirmar () {
      if (!this.nome) return this.chamarAlerta('primary', 'Nome é obrigatorio!')
      if (!this.telefone) return this.chamarAlerta('primary', 'Telefone é obrigatorio!')
      let pedidoOk = true
      this.pedidos.forEach(pedido => {
        if (!pedido.Quantidade || !pedido.CodigoProduto) {
          pedidoOk = false
          return this.chamarAlerta('primary', 'Um item do seu pedido está incompleto!')
        }
      })
      if (pedidoOk) {
        this.revisao = []
        this.valorTotalRevisao = 0
        this.pedidos.forEach(pedido => {
          const novoItemParaRevisao = {
            Nome: pedido.CodigoProduto.Nome,
            Quantidade: pedido.Quantidade,
            Total: pedido.CodigoProduto.Preco * pedido.Quantidade
          }
          this.valorTotalRevisao = this.valorTotalRevisao + (pedido.CodigoProduto.Preco * pedido.Quantidade)
          this.revisao.push(novoItemParaRevisao)
        })
        this.dialogConfirmar = true
      }
    },

    finalizar () {
      this.pedidos.forEach(itens => {
        itens.CodigoProduto = itens.CodigoProduto.CodigoProduto
      })

      const novoPedido = {
        Loja: parseInt(this.$route.params.loja),
        Secao: parseInt(this.$route.params.secao),
        Nome: this.nome,
        Telefone: this.telefone.replace(/[^A-Z0-9]/ig, '').replace('(', '_').replace(')', ''),
        Status: 1,
        Data: moment().format(),
        Items: this.pedidos
      }
      Axios.post('http://pedidoapi.estanciasupermercados.com.br/api/Pedido', novoPedido).then(() => {
        this.alert2.on = true
      })
    },

    removerProduto (pedido) {
      const index = this.pedidos.indexOf(pedido)
      this.pedidos.splice(index, 1)
    },

    chamarAlerta (cor, texto) {
      this.alert.on = true
      this.alert.color = cor
      this.alert.text = texto
      setTimeout(() => {
        this.alert.on = false
      }, 3000)
    }
  }
}
</script>

<style scoped>
</style>
