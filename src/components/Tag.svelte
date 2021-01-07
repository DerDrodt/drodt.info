<script lang="ts">
  export let name: string;
</script>

<style lang="scss">
  .tag {
    box-sizing: border-box;
    border: 1px solid var(--flash);
    border-radius: 3px;
    padding: 4px;
    margin: 0 8px 0 0;
    font-size: 0.85rem;
    color: var(--flash);
    height: 24px;
    line-height: 28px;
    transition: all 0.25s ease-in;

    &:hover {
      background-color: var(--flash);
      color: #fff;
    }
  }
</style>

<a class="no-underline tag" href={`/blog?tag=${encodeURIComponent(name)}`}>
  {name}
</a>
