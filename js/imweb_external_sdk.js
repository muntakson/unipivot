(() => {
	class ImwebExternalSDK {
		getMemberInfo(apiKey) {
			return new Promise((resolve, reject) => {
				if (!apiKey || typeof apiKey !== 'string' || !apiKey.trim()) {
					const error = {
						code: 'INVALID_API_KEY',
						message: 'API Key가 유효하지 않습니다.'
					};
					reject(error);
					return;
				}

				const formData = new FormData();
				formData.append('api_key', apiKey);

				const controller = new AbortController();
				const timeoutId = setTimeout(() => controller.abort(), 10000);

				fetch('/ajax/sdk/get_login_member_data.cm', {
					method: 'POST',
					body: formData,
					signal: controller.signal
				})
				.then(response => {
					clearTimeout(timeoutId);
					if (!response.ok) {
						throw new Error(`HTTP ${response.status}: ${response.statusText}`);
					}
					return response.json();
				})
				.then(data => {
					if (data.success) {
						resolve(data.loginMemberInfo);
					} else {
						const error = {
							code: data.code || 'SERVER_ERROR',
							message: data.msg || '회원 정보 조회에 실패하였습니다.'
						};
						reject(error);
					}
				})
				.catch(error => {
					clearTimeout(timeoutId);
					const errorObj = {
						code: error.name === 'AbortError' ? 'TIMEOUT_ERROR' : 'NETWORK_ERROR',
						message: error.name === 'AbortError' ? '요청 시간이 초과되었습니다.' : (error.message || '네트워크 오류가 발생했습니다.')
					};
					reject(errorObj);
				});
			});
		}
	}
	window.ImwebExternalSDK = new ImwebExternalSDK();
})();