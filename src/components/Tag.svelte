<script lang="ts">
  export let name: string;
</script>

<style>
  .tag {
    border-radius: 3px;
    padding: 4px;
    margin: 0 8px 0 0;
    background-color: greenyellow;
  }
</style>

<a class="no-underline tag" href={`/blog?tag=${encodeURIComponent(name)}`}>
  {name}
</a>
