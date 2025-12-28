export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">QR 생성기</h3>
            <p className="text-gray-600 text-sm">
              빠르고 안전한 QR 코드 생성 서비스입니다. 
              모든 처리는 브라우저에서 이루어져 개인정보가 보호됩니다.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">링크</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="text-gray-600 hover:text-gray-900">
                  사용법
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-gray-900">
                  FAQ
                </a>
              </li>
              <li>
                <a href="/privacy" className="text-gray-600 hover:text-gray-900">
                  개인정보처리방침
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">광고</h3>
            <div className="bg-gray-200 h-24 rounded flex items-center justify-center">
              <span className="text-gray-500 text-sm">사이드바 광고 (300×250)</span>
            </div>
          </div>
        </div>
        
        <div className="border-t mt-8 pt-8 text-center">
          <p className="text-gray-600 text-sm">
            © 2024 QR 생성기. 모든 권리 보유.
          </p>
        </div>
      </div>
    </footer>
  );
}