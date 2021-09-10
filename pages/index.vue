<template>
  <div>
    <v-simple-table>
      <template #default>
        <thead>
          <tr>
            <th class="text-left">Nome</th>
            <th class="text-left">Email</th>
            <th class="text-left" style="text-align: center">
              Editar / Apagar
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user._id">
            <td @click.stop="loadTasks(user._id)">{{ user.name }}</td>
            <td @click.stop="loadTasks(user._id)">{{ user.email }}</td>
            <td>
              <v-btn
                class="mx-1"
                fab
                dark
                small
                color="indigo"
                @click.stop="loadUser(user._id)"
              >
                <v-icon dark> mdi-pencil </v-icon>
              </v-btn>

              <v-btn
                class="mx-1"
                color="red"
                fab
                small
                dark
                @click.stop="
                  idAux = user._id;
                  dialogDelete = true;
                "
              >
                <v-icon dark> mdi-delete </v-icon>
              </v-btn>
            </td>
          </tr>
        </tbody>
      </template>
    </v-simple-table>
    <v-overlay :value="isLoading">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
    <v-dialog v-model="dialogDelete" persistent max-width="290">
      <v-card>
        <v-card-title class="text-h5"> Apagar usuário. </v-card-title>
        <v-card-text>Tem certeza que deseja apagá-lo?</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="red darken-1"
            text
            @click="
              dialogDelete = false;
              idAux = '';
            "
          >
            Cancelar
          </v-btn>
          <v-btn color="red darken-1" text @click="deleteUser()"> Sim </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-row>
      <v-dialog v-model="dialog" persistent max-width="600px">
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            color="primary"
            dark
            v-bind="attrs"
            style="margin-top: 2%; margin-left: 1%"
            v-on="on"
          >
            Cadastrar Usuário
          </v-btn>
        </template>
        <v-form ref="form" v-model="valid" lazy-validation>
          <v-card>
            <v-card-title>
              <span class="text-h5">Cadastro de Usuário</span>
            </v-card-title>
            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12">
                    <v-text-field
                      v-model="name"
                      label="Nome"
                      :rules="nameRules"
                      :counter="30"
                      required
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <v-text-field
                      v-model="email"
                      label="Email"
                      :rules="emailRules"
                      required
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <v-text-field
                      v-model="password"
                      label="Senha"
                      type="password"
                      :counter="16"
                      :rules="senhaRules"
                      required
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="dialog = false">
                Fechar
              </v-btn>
              <v-btn color="blue darken-1" text @click="createUser()">
                Salvar
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-form>
      </v-dialog>
    </v-row>
    <v-snackbar v-model="snackbar">
      {{ text }}

      <template v-slot:action="{ attrs }">
        <v-btn color="pink" text v-bind="attrs" @click="snackbar = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>
    {{ teste }}
  </div>
</template>

<script>
import Vue from 'vue';
import { mapState, mapActions } from 'vuex';

export default Vue.extend({
  data() {
    return {
      url: 'http://localhost:5000/users',
      paste: '/users/edit/',
      dialog: false,
      valid: true,
      dialogDelete: false,
      idAux: '',
      nameRules: [
        (v) => !!v || 'Nome é obrigatório',
        (v) =>
          (v && v.length <= 30) ||
          'Nome não pode possuir mais que 30 caracteres',
      ],
      emailRules: [
        (v) => !!v || 'E-mail é obrigatório',
        (v) => /.+@.+\..+/.test(v) || 'E-mail inválido',
      ],
      senhaRules: [
        (v) => !!v || 'Senha é obrigatória',
        (v) =>
          (v && v.length <= 16) ||
          'Senha não pode possuir mais que 16 caracteres',
      ],
      name: '',
      password: '',
      email: '',
      text: '',
      snackbar: false,
    };
  },
  computed: {
    ...mapState('users', ['users', 'isLoading', 'teste']),
  },

  mounted() {
    this.$store.dispatch('users', ['loadUsr']);
  },
  methods: {
    ...mapActions('users', ['loadUsr']),
    async loadUsers() {
      try {
        // this.toggleOverlay();
        const request = await this.$axios.get(this.url);
        this.users = request.data;
      } catch (err) {
        alert('Error');
        // this.toggleOverlay();
      } finally {
        // this.toggleOverlay();
      }
    },

    loadUser(id) {
      this.$router.push(this.paste + id);
    },

    loadTasks(id) {
      this.$router.push('/tasks/users/' + id);
    },

    /* toggleOverlay() {
      this.overlay = !this.overlay;
    }, */

    async createUser() {
      try {
        // this.toggleOverlay();
        await this.$axios.post(this.url, {
          name: this.name,
          email: this.email,
          password: this.password,
          tasks: [],
        });
        this.name = '';
        this.email = '';
        this.password = '';
        this.dialog = false;
        this.text = 'Usuário salvo com sucesso!';
        this.snackbar = true;
        this.$refs.form.reset();
        this.loadUsers();
      } catch (err) {
        alert(err);
        // this.toggleOverlay();
      } finally {
        // this.toggleOverlay();
      }
    },
    async deleteUser() {
      try {
        // this.toggleOverlay();
        await this.$axios.delete(this.url + '/' + this.idAux);
        this.idAux = '';
        this.dialogDelete = false;
        this.text = 'Usuário deletado com sucesso!';
        this.snackbar = true;
        this.loadUsers();
      } catch (err) {
        alert(err);
        // this.toggleOverlay();
      } finally {
        // this.toggleOverlay();
      }
    },
  },
});
</script>
