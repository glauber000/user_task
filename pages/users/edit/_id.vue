<template>
  <div>
    <v-form ref="form" v-model="valid" lazy-validation>
      <v-text-field
        v-model="name"
        :counter="30"
        :rules="nameRules"
        label="Nome"
        required
      ></v-text-field>

      <v-text-field
        v-model="email"
        :rules="emailRules"
        label="E-mail"
        required
      ></v-text-field>

      <v-btn :disabled="!valid" color="success" class="mr-4" @click="save">
        Salvar
      </v-btn>
      <v-btn depressed color="error" class="mr-4" to="/"> Voltar </v-btn>
    </v-form>
    <v-overlay :value="overlay">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
  </div>
</template>

<script>
export default {
  data() {
    return {
      id: null,
      valid: true,
      name: '',
      nameRules: [
        (v) => !!v || 'Nome é obrigatório',
        (v) =>
          (v && v.length <= 30) ||
          'Nome não pode possuir mais que 30 caracteres',
      ],
      email: '',
      emailRules: [
        (v) => !!v || 'E-mail é obrigatório',
        (v) => /.+@.+\..+/.test(v) || 'E-mail inválido',
      ],
      url: 'http://localhost:5000/users/',
      user: null,
      overlay: false,
    };
  },

  mounted() {
    this.id = this.$route.params.id;
    this.loadUser();
  },

  methods: {
    async loadUser() {
      try {
        this.toggleOverlay();
        const request = await this.$axios.get(this.url + this.id);
        this.name = request.data.name;
        this.email = request.data.email;
        this.user = request.data;
      } catch (err) {
        alert('Error');
        this.toggleOverlay();
      } finally {
        this.toggleOverlay();
      }
    },

    async save() {
      try {
        this.toggleOverlay();
        this.user.name = this.name;
        this.user.email = this.email;
        await this.$axios.put(this.url + this.id, this.user);
        this.$router.push('/');
        this.$refs.form.reset();
      } catch (err) {
        alert('Error');
        this.toggleOverlay();
      } finally {
        this.toggleOverlay();
      }
    },

    toggleOverlay() {
      this.overlay = !this.overlay;
    },
  },
};
</script>
