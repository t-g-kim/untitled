export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">개인정보 처리방침</h1>
          
          <div className="prose max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">1. 개인정보 수집 및 이용</h2>
              <p className="text-gray-600 mb-4">
                본 QR 코드 생성기는 <strong>완전 클라이언트 사이드</strong>에서 작동하며, 
                사용자가 입력한 텍스트나 URL을 서버로 전송하지 않습니다.
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>모든 QR 코드 생성은 사용자의 브라우저에서 직접 처리됩니다</li>
                <li>입력된 데이터는 서버에 저장되지 않습니다</li>
                <li>생성된 QR 코드는 사용자의 기기에만 저장됩니다</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">2. 개인정보 보호</h2>
              <p className="text-gray-600 mb-4">
                사용자의 개인정보 보호를 위해 다음과 같은 조치를 취하고 있습니다:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>회원가입 불필요 - 개인정보 수집 없음</li>
                <li>네트워크 전송 없음 - 모든 처리는 로컬에서 수행</li>
                <li>데이터 저장 없음 - 서버에 어떠한 데이터도 저장하지 않음</li>
                <li>보안 헤더 적용 - XSS, CSRF 등 보안 위협 방지</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">3. 쿠키 및 로컬 스토리지</h2>
              <p className="text-gray-600 mb-4">
                사용자 경험 향상을 위해 최소한의 로컬 데이터를 사용합니다:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>QR 코드 생성 옵션 설정 (크기, 오류 정정 레벨)</li>
                <li>언어 설정 (한국어/영어)</li>
                <li>이 데이터는 사용자의 브라우저에만 저장되며 서버로 전송되지 않습니다</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">4. 광고 서비스</h2>
              <p className="text-gray-600 mb-4">
                본 서비스는 Google AdSense를 통해 광고를 표시합니다:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>Google AdSense는 자체 개인정보 처리방침을 따릅니다</li>
                <li>광고 표시를 위한 쿠키가 사용될 수 있습니다</li>
                <li>사용자는 브라우저 설정에서 쿠키를 차단할 수 있습니다</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">5. 제3자 서비스</h2>
              <p className="text-gray-600 mb-4">
                본 서비스에서 사용하는 제3자 서비스:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>Google AdSense (광고 서비스)</li>
                <li>Cloudflare Pages (호스팅 서비스)</li>
                <li>각 서비스는 자체 개인정보 처리방침을 가지고 있습니다</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">6. 연락처</h2>
              <p className="text-gray-600">
                개인정보 처리방침에 대한 문의사항이 있으시면 아래 연락처로 문의해 주세요:
              </p>
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <p className="text-gray-600">이메일: privacy@qr-generator.com</p>
                <p className="text-gray-600">최종 업데이트: 2024년 12월</p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}