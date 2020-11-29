<template>
  <div v-if='!liberado' class="acougue">
    <v-card>
      <v-container>
        <v-text-field
          v-model="senha"
          label="Codigo do funcionario"
        />
      </v-container>
    </v-card>
  </div>
  <div v-else class="acougue">
    <v-dialog
      v-model="dialogMaisInfo"
      persistent
      max-width="600"
    >
      <v-card>
        <v-card-title class="headline">
          Pedido de {{ infos.nome }}
        </v-card-title>
        <v-card-actions>
          <v-container fluid>
          <v-simple-table>
            <template v-slot:default>
              <thead>
                <tr>
                  <th class="text-left">
                    Produto
                  </th>
                  <th class="text-center">
                    Quantidade
                  </th>
                  <th class="text-right">
                    Objervações
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="item in infos.itens"
                  :key="item.nome"
                >
                  <td>{{ item.produto }}</td>
                  <td>{{ item.quantidade }}Kg(s)</td>
                  <td>{{ item.obs }}</td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
          </v-container>
        </v-card-actions>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="green lighten-3"
            elevation="0"
            @click="dialog = false"
          >
            Finalizar pedido
          </v-btn>
          <v-btn
            color="primary"
            elevation="0"
            @click="dialogMaisInfo = false"
          >
            Okay
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-container>
      <v-data-iterator
        :items="pedidos"
        :items-per-page.sync="pedidosPorPagina"
        :page="pagina"
        :search="search"
        :sort-by="sortBy.toLowerCase()"
        :sort-desc="sortDesc"
        hide-default-footer
        color='primary'
      >
        <template v-slot:header>
          <v-toolbar dark color="primary" class="mb-1">
            <v-text-field
              v-model="search"
              clearable
              flat
              solo-inverted
              hide-details
              class='black--text'
              prepend-inner-icon="mdi-magnify"
              label="Procurar"
            ></v-text-field>
              <template v-if="$vuetify.breakpoint.smAndUp">
              <v-spacer></v-spacer>
            <v-btn-toggle
              v-model="sortDesc"
              mandatory
            >
              <v-btn
                large
                depressed
                color="secondary"
                :value="false"
              >
                <div class='black--text'>Aguardando</div>
              </v-btn>
              <v-btn
                large
                depressed
                color="secondary"
                :value="true"
              >
                <div class='black--text'>Concluído</div>
              </v-btn>
            </v-btn-toggle>
            </template>
          </v-toolbar>
        </template>

        <template v-slot:default="props">
          <v-row>
            <v-col
              v-for="item in props.items"
              :key="item.nome"
              cols="12"
              sm="6"
              md="4"
              lg="3"
            >
              <v-card @click='abrirDialogMaisInfo(item)'>
                <v-card-title class="subheading font-weight-bold">
                  #{{ item.Codigo }} - {{ item.Nome }}
                </v-card-title>

                <v-divider></v-divider>

                <v-list dense>
                      <v-list-item>
                      <v-list-item-content>
                        Telefone:
                      </v-list-item-content>
                      <v-list-item-content
                        class="align-end red--text"
                        v-if="item.Status === 1"
                      >
                        {{ item.Telefone }}
                      </v-list-item-content>
                      <v-list-item-content
                        class="align-end green--text"
                        v-else
                      >
                        {{ item.Telefone}}
                      </v-list-item-content>
                    </v-list-item>
                    <v-list-item>
                      <v-list-item-content>
                        Status:
                      </v-list-item-content>
                      <v-list-item-content
                        class="align-end red--text"
                        v-if="item.Status === 1"
                      >
                        Aguardando
                      </v-list-item-content>
                      <v-list-item-content
                        class="align-end green--text"
                        v-else
                      >
                        Concluído
                      </v-list-item-content>
                    </v-list-item>
                </v-list>
              </v-card>
            </v-col>
          </v-row>
        </template>

        <template v-slot:footer>
          <v-row class="mt-2" align="center" justify="center">
            <span class="grey--text">Qnt por página</span>
            <v-menu offset-y>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  dark
                  text
                  color="primary"
                  class="ml-2"
                  v-bind="attrs"
                  v-on="on"
                >
                  {{ pedidosPorPagina }}
                  <v-icon>mdi-chevron-down</v-icon>
                </v-btn>
              </template>
              <v-list>
                <v-list-item
                  v-for="(number, index) in pedidosPorPaginaArray"
                  :key="index"
                  @click="carregarPedidosPorPagina(number)"
                >
                  <v-list-item-title>{{ number }}</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>

            <v-spacer></v-spacer>

            <span class="mr-4 grey--text">
              Página {{ pagina }} de {{ numberOfPages }}
            </span>
              <v-btn
                fab
                dark
                color="primary"
                class="mr-1"
                @click="formerPage"
              >
                <v-icon>mdi-chevron-left</v-icon>
              </v-btn>
              <v-btn
                fab
                dark
                color="primary"
                class="ml-1"
                @click="nextPage"
              >
                <v-icon>mdi-chevron-right</v-icon>
              </v-btn>
          </v-row>
        </template>
      </v-data-iterator>
    </v-container>
  </div>
</template>

<script>
import Axios from 'axios'
export default {
  name: 'acougue',
  data () {
    return {
      liberado: false,
      senha: null,
      infos: {
        nome: null,
        celular: null,
        itens: []
      },
      dialogMaisInfo: false,
      pedidosPorPaginaArray: [6, 12, 18],
      search: '',
      filter: {},
      sortDesc: false,
      pagina: 1,
      pedidosPorPagina: 6,
      sortBy: 'status',
      keys: [
        'Itens',
        'Telefone',
        'Status'

      ],
      pedidos: []
    }
  },
  computed: {
    numberOfPages () {
      return Math.ceil(this.pedidos.length / this.pedidosPorPagina)
    },
    filteredKeys () {
      return this.keys.filter((key) => key !== 'Nome')
    }
  },

  mounted () {
    this.liberado = true
    this.buscarDados()
    setInterval(() => this.buscarDados(), 15000)
  },

  watch: {
    senha: function (pw) {
      this.senha = pw
      if (this.senha === 'estancia123') {
        this.liberado = true
      }
    }
  },

  methods: {
    abrirDialogMaisInfo (pedido) {
      Axios.get(`http://pedidoapi.estanciasupermercados.com.br/api/Pedido/GetProdutos?pedido=${pedido.Codigo}`).then(itens => {
        const veio = itens.data.ResultObject
        this.infos = {
          nome: null,
          celular: null,
          itens: []
        }
        veio.forEach(item => {
          const novoItemInfo = {
            quantidade: item.Quantidade,
            produto: item.Produto,
            obs: item.Descricao
          }

          this.infos.itens.push(novoItemInfo)
        })
        this.infos.nome = pedido.Nome
        this.dialogMaisInfo = true
      })
    },

    nextPage () {
      if (this.pagina + 1 <= this.numberOfPages) this.pagina += 1
    },
    formerPage () {
      if (this.pagina - 1 >= 1) this.pagina -= 1
    },
    carregarPedidosPorPagina (number) {
      this.pedidosPorPagina = number
    },

    buscarDados () {
      Axios.get(`http://pedidoapi.estanciasupermercados.com.br/api/Pedido?loja=${this.$route.params.loja}&secao=${this.$route.params.secao}`).then(resp => {
        this.pedidos = resp.data.ResultObject
      })
    }
  }
}
</script>
