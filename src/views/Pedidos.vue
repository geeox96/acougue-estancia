<template>
  <div class="pedidos">
    <v-container>
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
            :key="pedido.key"
            style="width: 100%"
          >
            <v-divider />
            <v-container>
              <v-row>
                <v-col cols="12">
                  <v-combobox
                    v-model="pedido.tipo"
                    :items="tipos"
                    label="Tipo"
                    hide-details
                    outlined
                  ></v-combobox>
                </v-col>
                <v-col cols="12">
                  <v-combobox
                    v-model="pedido.produto"
                    :items="tipos"
                    label="Produto"
                    hide-details
                    outlined
                  ></v-combobox>
                </v-col>
                <v-col cols="12">
                  <v-combobox
                    v-model="pedido.quantidade"
                    :items="quantidade"
                    label="Quantidade"
                    suffix="KG(s)"
                    hide-details
                    outlined
                  ></v-combobox>
                </v-col>
                <v-col cols="12">
                  <v-combobox
                    v-model="pedido.corte"
                    :items="tipos"
                    label="Corte"
                    hide-details
                    outlined
                  ></v-combobox>
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    v-model="pedido.obs"
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
      <v-btn class="mt-8" large @click='finalizar' block elevation="0" color="primary"
            >Fazer pedido</v-btn
          >
    </v-container>
  </div>
</template>

<script>
export default {
  name: 'Pedidos',
  data () {
    return {
      nome: null,
      telefone: null,
      pedidos: [
        {
          key: 0,
          quantidade: 0.000,
          tipo: null,
          produto: null,
          corte: null,
          obs: null
        },
        {
          key: 1,
          quantidade: 0.250,
          tipo: null,
          produto: null,
          corte: null,
          obs: null
        }
      ],
      quantidade: [],
      formPedido: null,
      tipos: ['Bovino', 'Suino', 'Suvindo', 'Peixe', 'Ave']
    }
  },

  created () {
    let numero = 0
    for (let i = 0; i < 200; i++) {
      numero = numero + 0.250
      this.quantidade.push(numero)
    }
  },

  methods: {

    maisProduto () {
      const numero = this.pedidos.length + 1
      const novoProduto = {
        key: numero,
        quantidade: 0,
        tipo: null,
        produto: null,
        corte: null,
        obs: null
      }
      console.log(novoProduto)
      this.pedidos.push(novoProduto)
    },

    finalizar () {
      console.log('enviar')
    },

    removerProduto (pedido) {
      const index = this.pedidos.indexOf(pedido)
      this.pedidos.splice(index, 1)
    },

    mais (item) {
      console.log(item)
      item = item + 1
    },

    menos (item) {
      console.log('menos')
      item = item - 0.25
    }
  }
}
</script>
