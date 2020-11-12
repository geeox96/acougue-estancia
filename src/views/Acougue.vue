<template>
  <div class="acougue">
    <v-dialog
      v-model="dialogMaisInfo"
      persistent
      max-width="600"
    >
      <v-card>
        <v-card-title class="headline">
          {{ infos.nome }}
        </v-card-title>
        <v-card-title class="subtitle-1">
          {{ infos.celular }}
        </v-card-title>
        <v-card-actions>
          <v-container fluid>
          <v-simple-table>
            <template v-slot:default>
              <thead>
                <tr>
                  <th class="text-left">
                    Tipo
                  </th>
                  <th class="text-left">
                    Produto
                  </th>
                  <th class="text-right">
                    Quantidade
                  </th>
                  <th class="text-right">
                    Corte
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
                  <td>{{ item.tipo }}</td>
                  <td>{{ item.produto }}</td>
                  <td>{{ item.quantidade }}Kg(s)</td>
                  <td>{{ item.corte }}</td>
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
                  {{ item.nome }}
                </v-card-title>

                <v-divider></v-divider>

                <v-list dense>
                  <v-list-item
                    v-for="(key, index) in filteredKeys"
                    :key="index"
                  >
                    <v-list-item-content
                    >
                      {{ key }}:
                    </v-list-item-content>
                    <v-list-item-content
                      class="align-end green--text"
                      v-if="item.status === 'Concluído'"
                    >
                      {{ item[key.toLowerCase()] }}
                    </v-list-item-content>
                      <v-list-item-content
                      class="align-end primary--text"
                      v-else
                    >
                      {{ item[key.toLowerCase()] }}
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
            <v-rows>
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
            </v-rows>
          </v-row>
        </template>
      </v-data-iterator>
    </v-container>
  </div>
</template>

<script>
export default {
  name: 'Açougue',
  data () {
    return {
      infos: {
        nome: null,
        celular: null,
        itens: [{
          tipo: 'tipo',
          produto: 'produto',
          quantidade: 1.500,
          corte: 'corte',
          obs: 'observações do cliente'
        },
        {
          tipo: 'tipo do item',
          produto: 'produto do item',
          quantidade: 3.500,
          corte: 'corte do item',
          obs: 'observações do cliente'
        }]
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
        'Celular',
        'Status'

      ],
      pedidos: [
        {
          index: 1,
          nome: 'Claudio Barbosa - #1',
          itens: 3,
          celular: '11986599635',
          status: 'Aguardando'
        },
        {
          index: 2,
          nome: 'Lucas Barbosa - #2',
          itens: 1,
          celular: '(11) 98999-9658',
          status: 'Concluído'
        },
        {
          index: 3,
          nome: 'Marta - #3',
          itens: 2,
          celular: '(11) 99865 9555',
          status: 'Aguardando'
        }]
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

  methods: {
    abrirDialogMaisInfo (pedido) {
      this.infos.nome = pedido.nome
      this.infos.celular = pedido.celular
      this.dialogMaisInfo = true
    },

    nextPage () {
      if (this.pagina + 1 <= this.numberOfPages) this.pagina += 1
    },
    formerPage () {
      if (this.pagina - 1 >= 1) this.pagina -= 1
    },
    carregarPedidosPorPagina (number) {
      this.pedidosPorPagina = number
    }
  }
}
</script>
