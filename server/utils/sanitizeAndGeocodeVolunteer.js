function cleanString(value) {
  return typeof value === 'string' ? value.trim() : '';
}

function splitSkills(value) {
  if (Array.isArray(value)) {
    return value
      .map((skill) => cleanString(skill))
      .filter(Boolean);
  }

  if (typeof value === 'string') {
    return value
      .split(/[;,|]/)
      .map((skill) => cleanString(skill))
      .filter(Boolean);
  }

  return [];
}

function normalizePhoneNumber(value) {
  const normalized = cleanString(value).replace(/[^\d+]/g, '');
  return normalized || '';
}

function parseCoordinateString(value) {
  if (typeof value !== 'string') {
    return null;
  }

  const parts = value.split(',').map((part) => Number.parseFloat(part.trim()));

  if (parts.length !== 2 || parts.some((part) => Number.isNaN(part))) {
    return null;
  }

  const [first, second] = parts;
  const looksLikeLatLng = Math.abs(first) <= 90 && Math.abs(second) <= 180;

  return looksLikeLatLng ? [second, first] : [first, second];
}

async function geocodeAddress(address) {
  const normalizedAddress = cleanString(address);

  if (!normalizedAddress) {
    throw new Error('Address is required for geocoding');
  }

  try {
    const nodeGeocoderModule = await import('node-geocoder');
    const nodeGeocoder = nodeGeocoderModule.default;
    const geocoder = nodeGeocoder({
      provider: process.env.GEOCODER_PROVIDER || 'google',
      apiKey: process.env.GOOGLE_MAPS_API_KEY,
    });

    const [result] = await geocoder.geocode(normalizedAddress);

    if (!result || typeof result.longitude !== 'number' || typeof result.latitude !== 'number') {
      throw new Error('No geocoding result found');
    }

    return [result.longitude, result.latitude];
  } catch (error) {
    if (error.code === 'ERR_MODULE_NOT_FOUND') {
      throw new Error('Install node-geocoder and configure GOOGLE_MAPS_API_KEY to geocode addresses');
    }

    throw new Error(`Unable to geocode address: ${error.message}`);
  }
}

function buildGeoPoint(coordinates) {
  if (!Array.isArray(coordinates) || coordinates.length !== 2) {
    throw new Error('Location must contain [longitude, latitude]');
  }

  const [longitude, latitude] = coordinates.map((value) => Number(value));

  if (
    Number.isNaN(longitude) ||
    Number.isNaN(latitude) ||
    Math.abs(longitude) > 180 ||
    Math.abs(latitude) > 90
  ) {
    throw new Error('Location must be a valid GeoJSON Point [longitude, latitude]');
  }

  return {
    type: 'Point',
    coordinates: [longitude, latitude],
  };
}

export async function sanitizeAndGeocodeVolunteer(rawVolunteer = {}) {
  const name = cleanString(rawVolunteer.name || rawVolunteer.Name);
  const phoneNumber = normalizePhoneNumber(rawVolunteer.phoneNumber || rawVolunteer.Phone || rawVolunteer.phone);
  const address = cleanString(rawVolunteer.address || rawVolunteer.Address || rawVolunteer.Location);
  const status = cleanString(rawVolunteer.status || rawVolunteer.Status) || 'available';
  const skills = splitSkills(rawVolunteer.skills || rawVolunteer.Skills);

  let coordinates =
    Array.isArray(rawVolunteer.location?.coordinates) ? rawVolunteer.location.coordinates : null;

  if (!coordinates && Array.isArray(rawVolunteer.coordinates)) {
    coordinates = rawVolunteer.coordinates;
  }

  if (!coordinates && typeof rawVolunteer.Location === 'string') {
    coordinates = parseCoordinateString(rawVolunteer.Location);
  }

  if (!coordinates && typeof rawVolunteer.location === 'string') {
    coordinates = parseCoordinateString(rawVolunteer.location);
  }

  if (!coordinates) {
    const latitude = rawVolunteer.latitude ?? rawVolunteer.Latitude;
    const longitude = rawVolunteer.longitude ?? rawVolunteer.Longitude;

    if (latitude !== undefined && longitude !== undefined) {
      coordinates = [Number(longitude), Number(latitude)];
    }
  }

  if (!coordinates && address) {
    coordinates = await geocodeAddress(address);
  }

  return {
    name,
    phoneNumber,
    status,
    address,
    skills,
    location: buildGeoPoint(coordinates),
  };
}

export { geocodeAddress };
