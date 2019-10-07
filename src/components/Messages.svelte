<script>
	export let messages = [
		// 'plant a tree today',
		// 'copyright nick trombley',
		// 'made with love',
		// 'thanks for visiting',
		// 'secret message here',
		'n'
	];

	let seed = messages.length;
	let randomMessage = messages[Math.floor(Math.random() * seed)];
</script>

<span>
	{randomMessage}
</span>
