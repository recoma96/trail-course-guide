export {};

// window.naver로 인해 build가 안되는 이슈를 막기 위해 세팅함
declare global {
  interface Window {
    naver?: typeof naver;
  }
}
