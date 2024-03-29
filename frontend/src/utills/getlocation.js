import { allcontinents, allcountries } from "../assets/json/location";

const compareString = (x, y) => {
  let a = x.label.toUpperCase(),
    b = y.label.toUpperCase();
  return a == b ? 0 : a > b ? 1 : -1;
};

const continentsOptions = (isNegative, possibleLocations) => {
  console.log(isNegative, "possibleLocations", possibleLocations);
  const continents = [
    { value: isNegative ? "ALL" : "ALL", label: isNegative ? "ALL" : "ALL" },
  ];
  console.log(continents);
  possibleLocations
    .filter((options) => options.instances > (isNegative ? -1 : 3))
    .forEach((location) => {
      if (!location.value.includes("_")) {
        const existingContinent = allcontinents.find(
          (continent) => continent.code === location.value
        );
        continents.push({
          value: location.value,
          label: existingContinent ? existingContinent.name : location.value,
        });
      }
    });
  return continents.sort(compareString);
};
const countriesOptions = (continentCode, isNegative, possibleLocations) => {
  const countries = [
    { value: isNegative ? "ALL" : "ALL", label: isNegative ? "ALL" : "ALL" },
  ];
  possibleLocations
    .filter((options) => options.instances > (isNegative ? -1 : 3))
    .forEach((location) => {
      if (
        !location.value.split("_")[2] &&
        location.value.startsWith(`${continentCode}_`)
      ) {
        const existingCountry = allcountries.find(
          (country) => country.code === location.value.split("_")[1]
        );
        countries.push({
          value: location.value.split("_")[1],
          label: existingCountry
            ? existingCountry.name
            : location.value.split("_")[1],
        });
      }
    });
  return countries.sort(compareString);
};
const regionsOptions = (
  continentCode,
  countryCode,
  isNegative,
  possibleLocations
) => {
  const regions = [
    { value: isNegative ? "ALL" : "ALL", label: isNegative ? "ALL" : "ALL" },
  ];
  possibleLocations
    .filter((options) => options.instances > (isNegative ? -1 : 3))
    .forEach((location) => {
      if (location.value.startsWith(`${continentCode}_${countryCode}_`)) {
        regions.push({
          value: location.value.split("_")[2],
          label: location.value.split("_")[2],
        });
      }
    });
  return regions.sort(compareString);
};
const getLocation = (geo) => {
  const specifiedLocation = geo.slice(2);
  const locations = specifiedLocation.split("_");
  const continentCode = locations[0];
  const countryCode = locations[1];
  const regionName = locations[2];
  const continentExists = allcontinents.find(
    (continent) => continent.code === continentCode
  ) || { name: "ALL" };
  const countryExists = allcountries.find(
    (country) => country.code === countryCode
  ) || { name: "ALL" };
  let text = "";
  if (continentExists.name !== "ALL") {
    if (continentExists) {
      text = text + continentExists.name;
    }
    if (countryExists && countryExists.name !== "ALL") {
      text = text + " " + countryExists.name;
    }
    if (regionName && regionName !== "ALL") {
      text = text + " " + regionName;
    }
  } else {
    text = "ALL";
  }
  console.log(text);
  return text;
};
export { continentsOptions, countriesOptions, regionsOptions, getLocation };
