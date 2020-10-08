<script lang="ts">
  import { color as tagColor } from "../util/tag-color";
  export let name: string;

  let color = tagColor(name);
</script>

<style>
  .tag {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    border-radius: 3px;
    padding: 4px;
    margin: 0 8px 0 0;
    font-size: 0.8rem;
    color: #fff;
    height: 24px;
    line-height: 28px;
  }
</style>

<a
  class="no-underline tag"
  style={`background-color: #${color}`}
  href={`/blog?tag=${encodeURIComponent(name)}`}>
  {name}
</a>
