function getUrlParameter(name) {
  const url = new URL(window.location.href);
  return url.searchParams.get(name);
}

function truncateToDecimals(value, n) {
  const multiplier = Math.pow(10, n);
  // Multiply the number, truncate the result, then divide back
  return Math.trunc(value * multiplier) / multiplier;
}

function _GetDifficultiesResourcePath(data) {
  var assets_path = "/resource/face/";
  var _epic = "-epic";
  var _feature = "-featured";
  switch (data.difficulty) {
    case 0: {
      var difficulty = "unrated";
      if (data.quality == 0)
        return `${assets_path}${difficulty}.png`;
      if (data.quality == 1)
        return `${assets_path}${difficulty}${_epic}.png`;
      if (data.quality == 2)
        return `${assets_path}${difficulty}${_feature}.png`;

      return `${assets_path}unrated.png`
    }
    case 1: {
      var difficulty = "auto";
      if (data.quality == 0)
        return `${assets_path}${difficulty}.png`;
      if (data.quality == 1)
        return `${assets_path}${difficulty}${_epic}.png`;
      if (data.quality == 2)
        return `${assets_path}${difficulty}${_feature}.png`;

      return `${assets_path}unrated.png`
    }
    case 2: {
      var difficulty = "easy";
      if (data.quality == 0)
        return `${assets_path}${difficulty}.png`;
      if (data.quality == 1)
        return `${assets_path}${difficulty}${_epic}.png`;
      if (data.quality == 2)
        return `${assets_path}${difficulty}${_feature}.png`;

      return `${assets_path}unrated.png`
    }
    case 3: {
      var difficulty = "normal";
      if (data.quality == 0)
        return `${assets_path}${difficulty}.png`;
      if (data.quality == 1)
        return `${assets_path}${difficulty}${_epic}.png`;
      if (data.quality == 2)
        return `${assets_path}${difficulty}${_feature}.png`;

      return `${assets_path}unrated.png`
    }
    case 4: {
      var difficulty = "hard";
      if (data.quality == 0)
        return `${assets_path}${difficulty}.png`;
      if (data.quality == 1)
        return `${assets_path}${difficulty}${_epic}.png`;
      if (data.quality == 2)
        return `${assets_path}${difficulty}${_feature}.png`;

      return `${assets_path}unrated.png`
    }
    case 5: {
      var difficulty = "harder";
      if (data.quality == 0)
        return `${assets_path}${difficulty}.png`;
      if (data.quality == 1)
        return `${assets_path}${difficulty}${_epic}.png`;
      if (data.quality == 2)
        return `${assets_path}${difficulty}${_feature}.png`;

      return `${assets_path}unrated.png`
    }
    case 6: {
      var difficulty = "insane";
      if (data.quality == 0)
        return `${assets_path}${difficulty}.png`;
      if (data.quality == 1)
        return `${assets_path}${difficulty}${_epic}.png`;
      if (data.quality == 2)
        return `${assets_path}${difficulty}${_feature}.png`;

      return `${assets_path}unrated.png`
    }
    case 7: {
      var difficulty = "demon";
      if (data.quality == 0)
        return `${assets_path}${difficulty}.png`;
      if (data.quality == 1)
        return `${assets_path}${difficulty}${_epic}.png`;
      if (data.quality == 2)
        return `${assets_path}${difficulty}${_feature}.png`;

      return `${assets_path}unrated.png`
    }
    case 8: {
      var difficulty = "demon-easy";
      if (data.quality == 0)
        return `${assets_path}${difficulty}.png`;
      if (data.quality == 1)
        return `${assets_path}${difficulty}${_epic}.png`;
      if (data.quality == 2)
        return `${assets_path}${difficulty}${_feature}.png`;

      return `${assets_path}unrated.png`
    }
    case 9: {
      var difficulty = "demon-medium";
      if (data.quality == 0)
        return `${assets_path}${difficulty}.png`;
      if (data.quality == 1)
        return `${assets_path}${difficulty}${_epic}.png`;
      if (data.quality == 2)
        return `${assets_path}${difficulty}${_feature}.png`;

      return `${assets_path}unrated.png`
    }
    case 10: {
      var difficulty = "demon-hard";
      if (data.quality == 0)
        return `${assets_path}${difficulty}.png`;
      if (data.quality == 1)
        return `${assets_path}${difficulty}${_epic}.png`;
      if (data.quality == 2)
        return `${assets_path}${difficulty}${_feature}.png`;

      return `${assets_path}unrated.png`
    }
    case 11: {
      var difficulty = "demon-insane";
      if (data.quality == 0)
        return `${assets_path}${difficulty}.png`;
      if (data.quality == 1)
        return `${assets_path}${difficulty}${_epic}.png`;
      if (data.quality == 2)
        return `${assets_path}${difficulty}${_feature}.png`;

      return `${assets_path}unrated.png`
    }
    case 12: {
      var difficulty = "demon-extreme";
      if (data.quality == 0)
        return `${assets_path}${difficulty}.png`;
      if (data.quality == 1)
        return `${assets_path}${difficulty}${_epic}.png`;
      if (data.quality == 2)
        return `${assets_path}${difficulty}${_feature}.png`;

      return `${assets_path}unrated.png`
    }
    
  }
}

function _show_message(msg) {
  alert(msg);
}

const Unfinished = ()=> {
  _show_message(`Oh no! This feature is currently in development.
You can always check our project progress on Github :>`);
}

const to_number = (str) => {
  let _string = "";
  for (let i = 0 ; i < str.length; i++)
    if (str[i] == '.' || (str[i] >= '0' && str[i] <= '9'))
      _string += str[i];
  return Number(_string);
}

function download_files(url, output) {
  const xhr = new XMLHttpRequest();
  xhr.responseType = 'blob';
  xhr.onload = function() {
    const urlCreator = window.URL || window.webkitURL;
    const imageUrl = urlCreator.createObjectURL(this.response);
    const a = document.createElement('a');
    a.href = imageUrl;
    a.download = output;
    a.click();
  };
  xhr.open('GET', url);
  xhr.send();
}

function copyTextToClipboard(text) {
  navigator.clipboard.writeText(text).then(() => {
    console.log("Text copied to clipboard successfully!");
  }).catch(err => {
    console.error("Could not copy text: ", err);
  });
}

export { getUrlParameter, truncateToDecimals, _GetDifficultiesResourcePath, _show_message, Unfinished, to_number, download_files, copyTextToClipboard};