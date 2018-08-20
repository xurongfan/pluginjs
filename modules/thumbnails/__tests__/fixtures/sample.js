import { parseHTML } from '@pluginjs/dom'

export default () => parseHTML`
<div class="thumbnails">
  <img src="https://picsum.photos/100?image=10" />
  <img src="https://picsum.photos/100?image=11" />
  <img src="https://picsum.photos/100?image=12" data-type="video"/>
  <img src="https://picsum.photos/100?image=13" />
  <img src="https://picsum.photos/100?image=14" />
  <img src="https://picsum.photos/100?image=15" />
  <img src="https://picsum.photos/100?image=16" />
  <img src="https://picsum.photos/100?image=17" />
  <img src="https://picsum.photos/100?image=18" />
  <img src="https://picsum.photos/100?image=19" />
  <img src="https://picsum.photos/100?image=30" data-type="video"/>
  <img src="https://picsum.photos/100?image=31" />
  <img src="https://picsum.photos/100?image=32" />
  <img src="https://picsum.photos/100?image=33" />
  <img src="https://picsum.photos/100?image=34" />
  <img src="https://picsum.photos/100?image=35" />
  <img src="https://picsum.photos/100?image=36" />
  <img src="https://picsum.photos/100?image=37" />
  <img src="https://picsum.photos/100?image=38" />
  <img src="https://picsum.photos/100?image=39" />
</div>
`
