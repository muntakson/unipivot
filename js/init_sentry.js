(function() {
  try {
    const EXTRA_KEY = "ROUTE_TO";
    const SENTRY_FO_SHOP_DSN = "https://aedf9f5b48de33cbaaea5c1ab8038f1d@o4509241587597312.ingest.us.sentry.io/4509307606794240";

    const transport = Sentry.makeMultiplexedTransport(
      Sentry.makeFetchTransport,
      (args) => {
        const event = args.getEvent();
        if (
          event &&
          event.extra &&
          EXTRA_KEY in event.extra &&
          Array.isArray(event.extra[EXTRA_KEY])
        ) {
          return event.extra[EXTRA_KEY];
        }
        return [];
      }
    );

    const SENTRY_ENABLED_SITES = {
      "닥터피엘": "S20240510bb273a9dcaf2f",
      "톡스웰": "S2023112193f6b6f5df998",
      "대한민국농수산": "S202503072a75d91d55d18",
      "모무": "S202303281d5896e2ed8fe",
      "호무로": "S20220211b601322b3a563", // 디버깅을 위한 임시 적용
      "테스트": "S2017090859b1e4072a107" // 디버깅을 위한 임시 적용
    };

    Sentry.init({
      dsn: SENTRY_FO_SHOP_DSN,
      environment: TEST_SERVER ? "development" : "production",
      integrations: [Sentry.moduleMetadataIntegration()],
      transport,
      sampleRate: (SITE_CODE === SENTRY_ENABLED_SITES.호무로 || SITE_CODE === SENTRY_ENABLED_SITES.테스트) ? 1 : 0.05, // 디버깅을 위한 임시 적용 (기존 0.05)
      beforeSend: (event) => {
        // MFE 에러 전송
        if (event?.exception?.values?.[0]?.stacktrace?.frames) {
          const frames = event.exception.values[0].stacktrace.frames;
          const handled = !!event?.exception?.values?.[0]?.mechanism?.handled;

          // DSN 설정을 갖고 있는(mfe 앱에서 발생한) 마지막 프레임
          const routeTo = frames
            .filter((frame) => frame.module_metadata && frame.module_metadata.dsn)
            .map((v) => v.module_metadata)
            .slice(-1);

          // 명시적으로 처리된(hanlded) 에러만 트래킹
          if (handled && routeTo.length) { 
            event.extra = { 
              ...event.extra,
              [EXTRA_KEY]: routeTo,
            };
            return event;
          }
        }

        // 특정 사이트 에러 전송
        if(Object.values(SENTRY_ENABLED_SITES).includes(SITE_CODE)) {
          if(SITE_CODE === SENTRY_ENABLED_SITES.호무로 || SITE_CODE === SENTRY_ENABLED_SITES.테스트) {
            if(event.message && event.message.includes('DEBUG')) {
              return event;
            }
            return null;
          }
          return event;
        }

        // 이외의 이벤트는 전송하지 않음
        return null;
      },
    });

    Sentry.setTag("site_code", SITE_CODE);
    Sentry.setTag("unit_code", UNIT_CODE);
  } catch (error) {
    console.warn("Issue during Sentry initialization: Some error tracking features may be limited.", error);
  }
})();
