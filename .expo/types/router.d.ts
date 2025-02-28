/* eslint-disable */
import * as Router from 'expo-router';

export * from 'expo-router';

declare module 'expo-router' {
  export namespace ExpoRouter {
    export interface __routes<T extends string | object = string> {
      hrefInputParams: { pathname: Router.RelativePathString, params?: Router.UnknownInputParams } | { pathname: Router.ExternalPathString, params?: Router.UnknownInputParams } | { pathname: `/_sitemap`; params?: Router.UnknownInputParams; } | { pathname: `${'/(tabs)'}/assistant` | `/assistant`; params?: Router.UnknownInputParams; } | { pathname: `${'/(tabs)'}` | `/`; params?: Router.UnknownInputParams; } | { pathname: `${'/(tabs)'}/Offers` | `/Offers`; params?: Router.UnknownInputParams; } | { pathname: `${'/(tabs)'}/Requests` | `/Requests`; params?: Router.UnknownInputParams; } | { pathname: `${'/(tabs)'}/Vessel` | `/Vessel`; params?: Router.UnknownInputParams; } | { pathname: `/Detail/AdminPanel`; params?: Router.UnknownInputParams; } | { pathname: `/Detail/AnalysisDetail`; params?: Router.UnknownInputParams; } | { pathname: `/Detail/NewsDetail`; params?: Router.UnknownInputParams; } | { pathname: `/Detail/OfferDetail`; params?: Router.UnknownInputParams; } | { pathname: `/Detail/OfferDetailScreen`; params?: Router.UnknownInputParams; } | { pathname: `/Detail/RequestDetail`; params?: Router.UnknownInputParams; } | { pathname: `/Detail/useCache`; params?: Router.UnknownInputParams; } | { pathname: `/Detail/VesselDetail`; params?: Router.UnknownInputParams; } | { pathname: `/styles/globalStyles`; params?: Router.UnknownInputParams; } | { pathname: `/+not-found`, params: Router.UnknownInputParams & {  } };
      hrefOutputParams: { pathname: Router.RelativePathString, params?: Router.UnknownOutputParams } | { pathname: Router.ExternalPathString, params?: Router.UnknownOutputParams } | { pathname: `/_sitemap`; params?: Router.UnknownOutputParams; } | { pathname: `${'/(tabs)'}/assistant` | `/assistant`; params?: Router.UnknownOutputParams; } | { pathname: `${'/(tabs)'}` | `/`; params?: Router.UnknownOutputParams; } | { pathname: `${'/(tabs)'}/Offers` | `/Offers`; params?: Router.UnknownOutputParams; } | { pathname: `${'/(tabs)'}/Requests` | `/Requests`; params?: Router.UnknownOutputParams; } | { pathname: `${'/(tabs)'}/Vessel` | `/Vessel`; params?: Router.UnknownOutputParams; } | { pathname: `/Detail/AdminPanel`; params?: Router.UnknownOutputParams; } | { pathname: `/Detail/AnalysisDetail`; params?: Router.UnknownOutputParams; } | { pathname: `/Detail/NewsDetail`; params?: Router.UnknownOutputParams; } | { pathname: `/Detail/OfferDetail`; params?: Router.UnknownOutputParams; } | { pathname: `/Detail/OfferDetailScreen`; params?: Router.UnknownOutputParams; } | { pathname: `/Detail/RequestDetail`; params?: Router.UnknownOutputParams; } | { pathname: `/Detail/useCache`; params?: Router.UnknownOutputParams; } | { pathname: `/Detail/VesselDetail`; params?: Router.UnknownOutputParams; } | { pathname: `/styles/globalStyles`; params?: Router.UnknownOutputParams; } | { pathname: `/+not-found`, params: Router.UnknownOutputParams & {  } };
      href: Router.RelativePathString | Router.ExternalPathString | `/_sitemap${`?${string}` | `#${string}` | ''}` | `${'/(tabs)'}/assistant${`?${string}` | `#${string}` | ''}` | `/assistant${`?${string}` | `#${string}` | ''}` | `${'/(tabs)'}${`?${string}` | `#${string}` | ''}` | `/${`?${string}` | `#${string}` | ''}` | `${'/(tabs)'}/Offers${`?${string}` | `#${string}` | ''}` | `/Offers${`?${string}` | `#${string}` | ''}` | `${'/(tabs)'}/Requests${`?${string}` | `#${string}` | ''}` | `/Requests${`?${string}` | `#${string}` | ''}` | `${'/(tabs)'}/Vessel${`?${string}` | `#${string}` | ''}` | `/Vessel${`?${string}` | `#${string}` | ''}` | `/Detail/AdminPanel${`?${string}` | `#${string}` | ''}` | `/Detail/AnalysisDetail${`?${string}` | `#${string}` | ''}` | `/Detail/NewsDetail${`?${string}` | `#${string}` | ''}` | `/Detail/OfferDetail${`?${string}` | `#${string}` | ''}` | `/Detail/OfferDetailScreen${`?${string}` | `#${string}` | ''}` | `/Detail/RequestDetail${`?${string}` | `#${string}` | ''}` | `/Detail/useCache${`?${string}` | `#${string}` | ''}` | `/Detail/VesselDetail${`?${string}` | `#${string}` | ''}` | `/styles/globalStyles${`?${string}` | `#${string}` | ''}` | { pathname: Router.RelativePathString, params?: Router.UnknownInputParams } | { pathname: Router.ExternalPathString, params?: Router.UnknownInputParams } | { pathname: `/_sitemap`; params?: Router.UnknownInputParams; } | { pathname: `${'/(tabs)'}/assistant` | `/assistant`; params?: Router.UnknownInputParams; } | { pathname: `${'/(tabs)'}` | `/`; params?: Router.UnknownInputParams; } | { pathname: `${'/(tabs)'}/Offers` | `/Offers`; params?: Router.UnknownInputParams; } | { pathname: `${'/(tabs)'}/Requests` | `/Requests`; params?: Router.UnknownInputParams; } | { pathname: `${'/(tabs)'}/Vessel` | `/Vessel`; params?: Router.UnknownInputParams; } | { pathname: `/Detail/AdminPanel`; params?: Router.UnknownInputParams; } | { pathname: `/Detail/AnalysisDetail`; params?: Router.UnknownInputParams; } | { pathname: `/Detail/NewsDetail`; params?: Router.UnknownInputParams; } | { pathname: `/Detail/OfferDetail`; params?: Router.UnknownInputParams; } | { pathname: `/Detail/OfferDetailScreen`; params?: Router.UnknownInputParams; } | { pathname: `/Detail/RequestDetail`; params?: Router.UnknownInputParams; } | { pathname: `/Detail/useCache`; params?: Router.UnknownInputParams; } | { pathname: `/Detail/VesselDetail`; params?: Router.UnknownInputParams; } | { pathname: `/styles/globalStyles`; params?: Router.UnknownInputParams; } | `/+not-found` | { pathname: `/+not-found`, params: Router.UnknownInputParams & {  } };
    }
  }
}
