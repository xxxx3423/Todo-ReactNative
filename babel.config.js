module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // Если у тебя есть другие плагины, добавь их СЮДА
      'react-native-reanimated/plugin', 
    ],
  };
};