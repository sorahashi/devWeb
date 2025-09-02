<script>
	import { onMount } from 'svelte';
	import { userApi } from '$lib/user-api.js';

	let users = [];
	let newUser = { username: '', email: '', password: '' };
	let loading = false;
	let message = '';

	onMount(async () => {
		await fetchUsers();
	});

	async function fetchUsers() {
		try {
			loading = true;
			users = await userApi.getAll();
		} catch (error) {
			console.error('Error fetching users:', error);
			message = 'ユーザーの取得に失敗しました';
		} finally {
			loading = false;
		}
	}

	async function createUser() {
		try {
			loading = true;
			await userApi.create(newUser);
			message = 'ユーザーが作成されました！';
			newUser = { username: '', email: '', password: '' };
			await fetchUsers();
		} catch (error) {
			console.error('Error creating user:', error);
			message = error.message || 'ユーザーの作成に失敗しました';
		} finally {
			loading = false;
		}
	}
</script>

<svelte:head>
	<title>WebApp - ユーザー管理</title>
</svelte:head>

<main class="min-h-screen bg-gradient-to-br from-pink-50 via-pink-100 to-purple-50 py-8 px-4">
	<div class="max-w-6xl mx-auto">
		<!-- ヘッダー -->
		<header class="text-center mb-12">
			<h1 class="text-5xl md:text-6xl font-bold text-gradient mb-4 animate-pulse-slow">
				✨ 超かわいいWebApp ✨
			</h1>
			<p class="text-xl text-pink-600 font-medium">
				ユーザー管理で楽しい時間を過ごそう〜 💕
			</p>
		</header>

		<!-- メッセージ表示 -->
		{#if message}
			<div class="mb-8 mx-auto max-w-2xl">
				<div class="p-4 rounded-2xl text-center font-semibold text-lg
					{message.includes('失敗') 
						? 'bg-red-100 text-red-700 border-2 border-red-300' 
						: 'bg-green-100 text-green-700 border-2 border-green-300'}">
					{message}
				</div>
			</div>
		{/if}

		<!-- ユーザー作成フォーム -->
		<section class="form-section mb-12">
			<h2 class="text-3xl font-bold text-center text-gradient mb-8">
				💖 新しいユーザーを作成
			</h2>
			<form on:submit|preventDefault={createUser} class="max-w-2xl mx-auto space-y-6">
				<div class="space-y-2">
					<label for="username" class="block text-lg font-semibold text-pink-700">
						ユーザー名
					</label>
					<input 
						id="username" 
						type="text" 
						bind:value={newUser.username} 
						required 
						placeholder="かわいいユーザー名を入力してね〜"
						class="input-field"
					/>
				</div>
				
				<div class="space-y-2">
					<label for="email" class="block text-lg font-semibold text-pink-700">
						メールアドレス
					</label>
					<input 
						id="email" 
						type="email" 
						bind:value={newUser.email} 
						required 
						placeholder="example@email.com"
						class="input-field"
					/>
				</div>
				
				<div class="space-y-2">
					<label for="password" class="block text-lg font-semibold text-pink-700">
						パスワード
					</label>
					<input 
						id="password" 
						type="password" 
						bind:value={newUser.password} 
						required 
						placeholder="安全なパスワードを入力してね〜"
						class="input-field"
					/>
				</div>
				
				<button type="submit" disabled={loading} class="btn-primary w-full text-xl">
					{loading ? '作成中... ⏳' : 'ユーザーを作成 💕'}
				</button>
			</form>
		</section>

		<!-- ユーザー一覧 -->
		<section class="card p-8">
			<h2 class="text-3xl font-bold text-center text-gradient mb-8">
				👥 ユーザー一覧
			</h2>
			
			{#if loading}
				<div class="text-center py-12">
					<div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
					<p class="mt-4 text-lg text-pink-600">読み込み中... ⏳</p>
				</div>
			{:else if users.length === 0}
				<div class="text-center py-12">
					<div class="text-6xl mb-4">😢</div>
					<p class="text-xl text-pink-600">まだユーザーがいないよ〜</p>
					<p class="text-lg text-pink-500 mt-2">上で新しいユーザーを作成してみてね！</p>
				</div>
			{:else}
				<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{#each users as user}
						<div class="user-card group">
							<div class="text-center">
								<div class="w-16 h-16 bg-gradient-to-br from-pink-400 to-pink-600 rounded-full mx-auto mb-4 
									flex items-center justify-center text-2xl text-white font-bold group-hover:scale-110 
									transition-transform duration-300">
									{user.username.charAt(0).toUpperCase()}
								</div>
								<h3 class="text-xl font-bold text-pink-700 mb-2 group-hover:text-pink-800 transition-colors">
									🌟 {user.username}
								</h3>
								<p class="text-pink-600 mb-2 flex items-center justify-center">
									<span class="mr-2">📧</span>
									{user.email}
								</p>
								<p class="text-sm text-pink-500">
									📅 作成日: {new Date(user.createdAt).toLocaleDateString('ja-JP')}
								</p>
							</div>
						</div>
					{/each}
				</div>
			{/if}
		</section>

		<!-- フッター -->
		<footer class="text-center mt-16">
			<p class="text-pink-600 font-medium">
				Made with 💖 and TailwindCSS ✨
			</p>
		</footer>
	</div>
</main>
