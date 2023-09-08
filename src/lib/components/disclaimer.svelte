<script lang="ts">
	import { settingsStore } from '$lib/stores';
	import Money from './money.svelte';

	const handleDisclaimerButton = () => {
		settingsStore.update((current) => ({ ...current, hideDisclaimer: true }));
	};

	$: settings = $settingsStore;
</script>

<details open={!settings?.hideDisclaimer}>
	<summary>Disclaimer & Infos</summary>

	<div class="disclaimer">
		<h4>Stonky keeps track of your Dynatrace stock packages</h4>
		<div>
			Stonky stores all data on the device (LocalStorage and IndexedDB), so no account is needed and <b
				>your data never leaves the device</b
			>. However, that also means there is no way to syncronize your data across devices.
		</div>
		<div>It fetches the current market prices from the unofficial YFinance API, which may be flaky.</div>
		<div>
			The source code is available on <a href="https://github.com/j-be/stonky" target="_blank">GitHub</a>.
		</div>
		<div>
			We assume Austrian law. In detail:
			<ul>
				<li>Captial gain tax of 27.5%</li>
				<li>ESPPs are income tax free after 5 years. However, the 3.000€ cap is <b>NOT</b> taken into account.</li>
			</ul>
		</div>

		<div>
			The values are to be interpreted as net (i.e. applicable taxes deducted) Euro value in white, and raw US-Dollar
			value in gray. Example:
		</div>

		<div>
			<span class="example">12.34 € <small class="muted">(56.78 $)</small></span> means it is currently worth 56.78 $, and
			after deducting taxes and converting it you get 12.34 €.
		</div>

		<div>THIS IS NOT FINANCIAL ADVICE!</div>
		<div>
			THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO
			THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
			AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF
			CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
			IN THE SOFTWARE.
		</div>
	</div>
	{#if !settings.hideDisclaimer}
		<div class="hideButton">
			<button on:click={handleDisclaimerButton}>Hide on load</button>
		</div>
	{/if}
</details>
