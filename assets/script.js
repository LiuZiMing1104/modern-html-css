// -------------------------------------------------------------------
// ★モーダル
const openButton = document.getElementById("open")
const closeButton = document.getElementById("close")
const dialog = document.getElementById("dialog")

openButton.addEventListener("click", function () {
	dialog.showModal()
})

closeButton.addEventListener("click", function () {
	dialog.close("cancel")
})

dialog.addEventListener("close", function () {
	console.log(dialog.returnValue)
})

// -------------------------------------------------------------------
// ビュー遷移

// 遷移元（古いドキュメント）での処理
window.addEventListener("pageswap", async (e) => {
	if (!e.viewTransition) return

	// 遷移元・遷移先のファイル名を取得
	const oldPage = e.activation.from.url
		.replace(/\.html.*$/, "")
		.split("/")
		.pop()
	const newPage = e.activation.entry.url
		.replace(/\.html.*$/, "")
		.split("/")
		.pop()

	// Navigation APIに未対応なブラウザ用の設定
	if (!window.navigation) {
		sessionStorage.setItem("oldPage", oldPage)
		sessionStorage.setItem("newPage", newPage)
	}

	// 遷移元がindex.htmlの場合
	if (oldPage !== "office" && oldPage !== "setup" && oldPage !== "virtual") {
		// 遷移先の詳細と対になるカードの画像に遷移名を指定
		const cardImage = document.querySelector(`#${newPage} img`)
		// Codex チェック
		// 問題の説明: contact.html など、index.html 上に対応する id を持つカードが存在しないページへ遷移した場合、cardImage が null になり style アクセスで実行時エラーになります。
		// 修正アドバイス: cardImage の存在確認を入れてから viewTransitionName を設定するか、office/setup/virtual への遷移時だけ処理する条件に変更してください。
		cardImage.style.viewTransitionName = "photo"

		// 遷移後にBFCacheのカードの画像から遷移名を削除
		await e.viewTransition.finished
		cardImage.style.viewTransitionName = ""
	}
})

// 遷移先（新しいドキュメント）での処理
window.addEventListener("pagereveal", async (e) => {
	if (!e.viewTransition) return

	// 遷移元・遷移先のファイル名を取得
	let oldPage, newPage
	if (window.navigation) {
		// Navigation APIに対応したブラウザの場合
		oldPage = navigation.activation.from.url
			.replace(/\.html.*$/, "")
			.split("/")
			.pop()
		newPage = navigation.activation.entry.url
			.replace(/\.html.*$/, "")
			.split("/")
			.pop()
	} else {
		// Navigation APIに未対応なブラウザの場合
		oldPage = sessionStorage.getItem("oldPage")
		newPage = sessionStorage.getItem("newPage")
	}

	// 遷移先がindex.htmlの場合
	if (newPage !== "office" && newPage !== "setup" && newPage !== "virtual") {
		// 遷移元の詳細と対になるカードの画像に遷移名を指定
		const cardImage = document.querySelector(`#${oldPage} img`)
		// Codex チェック
		// 問題の説明: contact.html などカード要素を持たないページでこの処理が走ると、cardImage が null のまま style にアクセスしてコンソールエラーになります。
		// 修正アドバイス: cardImage が取得できた場合のみ処理するガードを追加し、詳細ページと一覧ページの組み合わせだけで動く条件に絞ってください。
		cardImage.style.viewTransitionName = "photo"

		// 遷移の準備ができたらカードの画像から遷移名を削除
		await e.viewTransition.ready
		cardImage.style.viewTransitionName = ""
	}
})
