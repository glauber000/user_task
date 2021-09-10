<template>
  <div>
    <v-simple-table>
      <template v-slot:default>
        <thead>
          <tr>
            <th class="text-left">Tarefa</th>
            <th class="text-left">Data</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="task in tasks" :key="task.task">
            <td>{{ task.task }}</td>
            <td>{{ task.data }}</td>
          </tr>
        </tbody>
      </template>
    </v-simple-table>
    <v-btn depressed color="error" class="mr-4" to="/" style="margin-top: 2%">
      Voltar
    </v-btn>
    <v-overlay :value="overlay">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
  </div>
</template>

<script>
export default {
  data() {
    return {
      id: 'Vazio',
      url: 'http://localhost:5000/users',
      tasks: null,
      overlay: false,
    };
  },

  mounted() {
    this.id = this.$route.params.id;
    this.load_tasks();
  },
  methods: {
    async load_tasks() {
      try {
        this.toggleOverlay();
        const request = await this.$axios.get(this.url + '/' + this.id);
        this.tasks = request.data.tasks;
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
