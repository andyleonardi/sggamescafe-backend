const { failureResponse, successResponse } = require("../utils/response");
const xmlConverter = require("xml-js");
const bggThingPath = "http://boardgamegeek.com/xmlapi2/thing?id=";
const bggSearchPath = "http://boardgamegeek.com/xmlapi2/search?query=";

// -----------------------------------------------------------------------------
// Functions to Fetch BGG Data
// -----------------------------------------------------------------------------
const wait1s = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

const getThingDetails = async (thingId) => {
  const thingPath = `${bggThingPath}${thingId}&stats=1&page=1&pagesize=50`;
  //   console.log("BGG API for thing: ", thingPath);

  try {
    let responseStatus = 202;
    let data = [];

    while (responseStatus === 202) {
      const response = await fetch(thingPath); // Fetch data from API
      responseStatus = response.status;
      const xmlData = await response.text(); // Convert XML to Text
      data = await xmlConverter.xml2js(xmlData, {
        compact: true,
        spaces: 4,
      }).items.item;
      if (responseStatus === 202) {
        await wait1s(1000);
      }
    }
    return data;
  } catch (error) {
    console.log("Error", error);
  }
};

const cleanOneThingDetails = (obj) => {
  const getName = (arr) => {
    if (Array.isArray(arr)) {
      const name = arr.find(
        (element) => element._attributes.type === "primary"
      );
      return name._attributes.value;
    } else {
      return arr._attributes.value;
    }
  };

  // This function is to get the values of mechanics and categories
  // Some game data does not have any category
  // Use if else to check if category is undefined
  const getValues = (arr) => {
    if (arr === undefined) {
      return [];
    } else {
      const newArr = arr.map((a) => {
        return a._attributes.value;
      });
      return newArr;
    }
  };

  const rawMechanics = obj.link.filter(
    (element) => element._attributes.type === "boardgamemechanic"
  );
  const mechanics = getValues(rawMechanics);
  const rawCategories = obj.link.filter(
    (element) => element._attributes.type === "boardgamecategory"
  );
  const category = getValues(rawCategories);

  return {
    name: getName(obj.name),
    bggThingId: obj._attributes.id,
    bggImgUrl: obj.image._text,
    bggImgThumb: obj.thumbnail._text,
    weight: obj.statistics.ratings.averageweight._attributes.value,
    minPlayer: obj.minplayers._attributes.value,
    maxPlayer: obj.maxplayers._attributes.value,
    minPlayTime: obj.minplaytime._attributes.value,
    maxPlayTime: obj.maxplaytime._attributes.value,
    category: category,
    mechanics: mechanics,
  };
};

const cleanThingDetails = (array) => {
  const cleanedArray = array.map((a) => {
    // Some game data has only 1 name, which makes it return an object instead
    // use if else to check if it's an array or not
    const getName = (arr) => {
      if (Array.isArray(arr)) {
        const name = arr.find(
          (element) => element._attributes.type === "primary"
        );
        return name._attributes.value;
      } else {
        return arr._attributes.value;
      }
    };

    // This function is to get the values of mechanics and categories
    // Some game data does not have any category
    // Use if else to check if category is undefined
    const getValues = (arr) => {
      if (arr === undefined) {
        return [];
      } else {
        const newArr = arr.map((a) => {
          return a._attributes.value;
        });
        return newArr;
      }
    };

    const rawMechanics = a.link.filter(
      (element) => element._attributes.type === "boardgamemechanic"
    );
    const mechanics = getValues(rawMechanics);
    const rawCategories = a.link.filter(
      (element) => element._attributes.type === "boardgamecategory"
    );
    const category = getValues(rawCategories);

    return {
      name: getName(a.name),
      bggThingId: a._attributes.id,
      bggImgUrl: a.image._text,
      bggImgThumb: obj.thumbnail._text,
      weight: obj.statistics.ratings.averageweight._attributes.value,
      minPlayer: a.minplayers._attributes.value,
      maxPlayer: a.maxplayers._attributes.value,
      minPlayTime: a.minplaytime._attributes.value,
      maxPlayTime: a.maxplaytime._attributes.value,
      category: category,
      mechanics: mechanics,
    };
  });
  return cleanedArray;
};

const getSearchResults = async (searchQuery) => {
  const searchPath = `${bggSearchPath}${searchQuery}`;
  console.log("BGG API for user's collection: ", searchPath);

  try {
    let responseStatus = 202;
    let data = [];

    while (responseStatus === 202) {
      const response = await fetch(searchPath); // Fetch data from API
      responseStatus = response.status;
      const xmlData = await response.text(); // Convert XML to Text
      data = await xmlConverter.xml2js(xmlData, {
        compact: true,
        spaces: 4,
      });
      if (responseStatus === 202) {
        await wait1s(1000);
      }
    }
    return data.items.item;
  } catch (error) {
    console.log("Error", error);
  }
};

const cleanSearchResults = (arr) => {
  console.log("data", arr);
  let cleanData = [];
  if (!Array.isArray(arr)) {
    cleanData.push({
      bggThingId: arr._attributes.id,
      name: arr.name._attributes.value,
    });
  } else {
    cleanData = arr.map((a) => {
      return {
        bggThingId: a._attributes.id,
        name: a.name._attributes.value,
      };
    });
  }

  return cleanData;
};

// -----------------------------------------------------------------------------
// Controllers
// -----------------------------------------------------------------------------
const show = async (req, res) => {
  try {
    const thingDetails = await getThingDetails(req.params.id);
    const cleanDetails = cleanOneThingDetails(thingDetails);
    return successResponse(res, 200, "Successfully retrieved details", {
      game: cleanDetails,
    });
  } catch (err) {
    console.error(err);
    return failureResponse(res, 500, "Internal server error");
  }
};

const searchGame = async (req, res) => {
  try {
    const searchResult = await getSearchResults(req.params.id);
    const cleanResult = cleanSearchResults(searchResult);
    return successResponse(res, 200, "Successfully searched", {
      result: cleanResult,
    });
  } catch (err) {
    console.error(err);
    return failureResponse(res, 500, "Internal server error");
  }
};

module.exports = {
  show,
  search: searchGame,
  //   bgg functions
  getThingDetails,
  cleanOneThingDetails,
};
