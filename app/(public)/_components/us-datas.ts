// us-locations.ts

enum Party {
  Democratic = 'democratic',
  Republican = 'republican',
  Independent = 'independent',
}

interface CandidateGroup {
  group: string;
  items: Candidate[];
}

interface Candidate {
  "name": string;
  "rating": string;
  "description": string;
  "link": string;
  "party": Party;
  "state": string; 
}

export const states = [
  'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado',
  'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho',
  'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana',
  'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi',
  'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey',
  'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma',
  'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota',
  'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington',
  'West Virginia', 'Wisconsin', 'Wyoming'
];

export const counties: { [key: string]: string[] } = {
  'Alabama': [
    'Autauga County', 'Baldwin County', 'Barbour County', 'Bibb County', 
    'Blount County', 'Bullock County', 'Butler County', 'Calhoun County',
    'Chambers County', 'Cherokee County', 'Chilton County', 'Clarke County',
    'Clay County', 'Cleburne County', 'Coffee County', 'Colbert County',
    'Conecuh County', 'Coosa County', 'Covington County', 'Crenshaw County',
    'Cullman County', 'Dale County', 'Dallas County', 'DeKalb County',
    'Elmore County', 'Escambia County', 'Etowah County', 'Fayette County',
    'Franklin County', 'Geneva County', 'Greene County', 'Hale County',
    'Henry County', 'Houston County', 'Jackson County', 'Jefferson County',
    'Lamar County', 'Lauderdale County', 'Lawrence County', 'Lee County',
    'Limestone County', 'Lowndes County', 'Macon County', 'Madison County',
    'Marengo County', 'Marion County', 'Marshall County', 'Mobile County',
    'Monroe County', 'Montgomery County', 'Morgan County', 'Perry County',
    'Pickens County', 'Pike County', 'Randolph County', 'Russell County',
    'Shelby County', 'St. Clair County', 'Sumter County', 'Talladega County',
    'Tallapoosa County', 'Tuscaloosa County', 'Walker County', 'Washington County',
    'Wilcox County', 'Winston County'
  ],
  'Alaska': [
    'Aleutians East Borough', 'Aleutians West Census Area', 'Anchorage Municipality',
    'Bethel Census Area', 'Bristol Bay Borough', 'Denali Borough', 'Dillingham Census Area',
    'Fairbanks North Star Borough', 'Haines Borough', 'Hoonah-Angoon Census Area',
    'Juneau City and Borough', 'Kenai Peninsula Borough', 'Ketchikan Gateway Borough',
    'Kodiak Island Borough', 'Lake and Peninsula Borough', 'Matanuska-Susitna Borough',
    'North Slope Borough', 'Northwest Arctic Borough', 'Petersburg Borough',
    'Prince of Wales-Hyder Census Area', 'Sitka City and Borough', 'Skagway Municipality',
    'Southeast Fairbanks Census Area', 'Valdez-Cordova Census Area', 'Wade Hampton Census Area',
    'Wrangell City and Borough', 'Yakutat City and Borough'
  ],
  'Arizona': [
    'Apache County', 'Cochise County', 'Coconino County', 'Gila County', 'Graham County',
    'Greenlee County', 'La Paz County', 'Maricopa County', 'Mohave County', 'Navajo County',
    'Pima County', 'Pinal County', 'Santa Cruz County', 'Yavapai County', 'Yuma County'
  ],
  'Arkansas': [
    'Arkansas County', 'Ashley County', 'Baxter County', 'Benton County', 'Boone County',
    'Bradley County', 'Calhoun County', 'Carroll County', 'Chicot County', 'Clark County',
    'Clay County', 'Cleburne County', 'Cleveland County', 'Columbia County', 'Conway County',
    'Craighead County', 'Crawford County', 'Cross County', 'Dallas County', 'Desha County',
    'Drew County', 'Faulkner County', 'Franklin County', 'Fulton County', 'Garland County',
    'Grant County', 'Greene County', 'Hempstead County', 'Hot Spring County', 'Howard County',
    'Independence County', 'Izard County', 'Jackson County', 'Jefferson County', 'Johnson County',
    'Lafayette County', 'Lawrence County', 'Lee County', 'Lincoln County', 'Little River County',
    'Logan County', 'Lonoke County', 'Madison County', 'Marion County', 'Miller County',
    'Mississippi County', 'Monroe County', 'Montgomery County', 'Nevada County', 'Newton County',
    'Ouachita County', 'Perry County', 'Phillips County', 'Pike County', 'Pope County',
    'Prairie County', 'Pulaski County', 'Randolph County', 'St. Francis County', 'Saline County',
    'Scott County', 'Searcy County', 'Sebastian County', 'Sevier County', 'Sharp County',
    'Stone County', 'Union County', 'Van Buren County', 'Washington County', 'White County',
    'Woodruff County', 'Yell County'
  ],
  'California': [
    'Alameda County', 'Alpine County', 'Amador County', 'Butte County', 'Calaveras County',
    'Colusa County', 'Contra Costa County', 'Del Norte County', 'El Dorado County', 'Fresno County',
    'Glenn County', 'Humboldt County', 'Imperial County', 'Inyo County', 'Kern County',
    'Kings County', 'Lake County', 'Lassen County', 'Los Angeles County', 'Madera County',
    'Marin County', 'Mariposa County', 'Mendocino County', 'Merced County', 'Modoc County',
    'Mono County', 'Monterey County', 'Napa County', 'Nevada County', 'Orange County',
    'Placer County', 'Plumas County', 'Riverside County', 'Sacramento County', 'San Benito County',
    'San Bernardino County', 'San Diego County', 'San Francisco County', 'San Joaquin County',
    'San Luis Obispo County', 'San Mateo County', 'Santa Barbara County', 'Santa Clara County',
    'Santa Cruz County', 'Shasta County', 'Sierra County', 'Siskiyou County', 'Solano County',
    'Sonoma County', 'Stanislaus County', 'Sutter County', 'Tehama County', 'Trinity County',
    'Tulare County', 'Tuolumne County', 'Ventura County', 'Yolo County', 'Yuba County'
  ],
  'Colorado': [
    'Adams County', 'Alamosa County', 'Arapahoe County', 'Archuleta County', 'Baca County',
    'Bent County', 'Boulder County', 'Broomfield County', 'Chaffee County', 'Cheyenne County',
    'Clear Creek County', 'Conejos County', 'Costilla County', 'Crowley County', 'Custer County',
    'Delta County', 'Denver County', 'Dolores County', 'Douglas County', 'Eagle County',
    'Elbert County', 'El Paso County', 'Fremont County', 'Garfield County', 'Gilpin County',
    'Grand County', 'Gunnison County', 'Huerfano County', 'Jackson County', 'Jefferson County',
    'Kiowa County', 'Kit Carson County', 'Lake County', 'La Plata County', 'Larimer County',
    'Las Animas County', 'Lincoln County', 'Logan County', 'Mesa County', 'Mineral County',
    'Moffat County', 'Montezuma County', 'Montrose County', 'Morgan County', 'Otero County',
    'Ouray County', 'Park County', 'Phillips County', 'Pitkin County', 'Prowers County',
    'Pueblo County', 'Rio Grande County', 'Rio Blanco County', 'Routt County', 'Saguache County',
    'San Juan County', 'San Miguel County', 'Sedgwick County', 'Summit County', 'Teller County',
    'Washington County', 'Weld County', 'Yuma County'
  ],
  'Connecticut': [
    'Fairfield County', 'Hartford County', 'Litchfield County', 'Middlesex County',
    'New Haven County', 'New London County', 'Tolland County', 'Windham County'
  ],
  'Delaware': [
    'Kent County', 'New Castle County', 'Sussex County'
  ],
  'Florida': [
    'Alachua County', 'Baker County', 'Bay County', 'Bradford County', 'Brevard County',
    'Broward County', 'Calhoun County', 'Charlotte County', 'Citrus County', 'Clay County',
    'Collier County', 'Columbia County', 'DeSoto County', 'Dixie County', 'Duval County',
    'Escambia County', 'Flagler County', 'Franklin County', 'Gadsden County', 'Gilchrist County',
    'Glades County', 'Gulf County', 'Hamilton County', 'Hardee County', 'Hendry County',
    'Hernando County', 'Highlands County', 'Hillsborough County', 'Holmes County', 'Indian River County',
    'Jackson County', 'Jefferson County', 'Lafayette County', 'Lake County', 'Lee County',
    'Leon County', 'Levy County', 'Liberty County', 'Madison County', 'Manatee County',
    'Marion County', 'Martin County', 'Miami-Dade County', 'Monroe County', 'Nassau County',
    'Okaloosa County', 'Okeechobee County', 'Orange County', 'Osceola County', 'Palm Beach County',
    'Pasco County', 'Pinellas County', 'Polk County', 'Putnam County', 'Santa Rosa County',
    'Sarasota County', 'Seminole County', 'Sumter County', 'Suwannee County', 'Taylor County',
    'Union County', 'Volusia County', 'Wakulla County', 'Walton County', 'Washington County'
  ],
  'Georgia': [
    'Appling County', 'Atkinson County', 'Bacon County', 'Baker County', 'Baldwin County',
    'Banks County', 'Barrow County', 'Bartow County', 'Ben Hill County', 'Berrien County',
    'Bibb County', 'Bleckley County', 'Brantley County', 'Brooks County', 'Bryan County',
    'Bulloch County', 'Burke County', 'Butts County', 'Calhoun County', 'Camden County',
    'Candler County', 'Carroll County', 'Catoosa County', 'Charlton County', 'Chatham County',
    'Chattahoochee County', 'Cherokee County', 'Clarke County', 'Clay County', 'Clayton County',
    'Clinch County', 'Cobb County', 'Coffee County', 'Colquitt County', 'Columbia County',
    'Cook County', 'Coweta County', 'Crawford County', 'Crisp County', 'Dade County',
    'Dawson County', 'Decatur County', 'DeKalb County', 'Dodge County', 'Dooly County',
    'Dougherty County', 'Douglas County', 'Early County', 'Echols County', 'Effingham County',
    'Elbert County', 'Emanuel County', 'Evans County', 'Fannin County', 'Fayette County',
    'Floyd County', 'Forsyth County', 'Franklin County', 'Fulton County', 'Gilmer County',
    'Glascock County', 'Glynn County', 'Gordon County', 'Grady County', 'Greene County',
    'Gwinnett County', 'Habersham County', 'Hall County', 'Hancock County', 'Haralson County',
    'Harris County', 'Hart County', 'Heard County', 'Henry County', 'Houston County',
    'Irwin County', 'Jackson County', 'Jasper County', 'Jeff Davis County', 'Jefferson County',
    'Jenkins County', 'Johnson County', 'Jones County', 'Lamar County', 'Lanier County',
    'Laurens County', 'Lee County', 'Liberty County', 'Lincoln County', 'Long County',
    'Lowndes County', 'Lumpkin County', 'McDuffie County', 'McIntosh County', 'Macon County',
    'Madison County', 'Marion County', 'Meriwether County', 'Miller County', 'Mitchell County',
    'Monroe County', 'Montgomery County', 'Morgan County', 'Murray County', 'Muscogee County',
    'Newton County', 'Oconee County', 'Oglethorpe County', 'Paulding County', 'Peach County',
    'Pickens County', 'Pierce County', 'Pike County', 'Polk County', 'Pulaski County',
    'Putnam County', 'Quitman County', 'Rabun County', 'Randolph County', 'Richmond County',
    'Rockdale County', 'Schley County', 'Screven County', 'Seminole County', 'Spalding County',
    'Stephens County', 'Stewart County', 'Sumter County', 'Talbot County', 'Taliaferro County',
    'Tattnall County', 'Taylor County', 'Telfair County', 'Terrell County', 'Thomas County',
    'Tift County', 'Toombs County', 'Towns County', 'Treutlen County', 'Troup County',
    'Turner County', 'Twiggs County', 'Union County', 'Upson County', 'Walker County',
    'Walton County', 'Ware County', 'Warren County', 'Washington County', 'White County',
    'Whitfield County', 'Wilcox County', 'Wilkes County', 'Worth County'
  ],
  'Hawaii': [
    'Hawaii County', 'Honolulu County', 'Kauai County', 'Maui County'
  ],
  'Idaho': [
    'Ada County', 'Adams County', 'Bannock County', 'Bear Lake County', 'Benewah County',
    'Bingham County', 'Blaine County', 'Boise County', 'Bonner County', 'Bonneville County',
    'Boundary County', 'Butte County', 'Camas County', 'Canyon County', 'Caribou County',
    'Cassia County', 'Clark County', 'Clearwater County', 'Elmore County', 'Franklin County',
    'Fremont County', 'Gem County', 'Gooding County', 'Idaho County', 'Jefferson County',
    'Jerome County', 'Kootenai County', 'Latah County', 'Lemhi County', 'Lewis County',
    'Lincoln County', 'Madison County', 'Minidoka County', 'Nez Perce County', 'Oneida County',
    'Owyhee County', 'Payette County', 'Power County', 'Shoshone County', 'Teton County',
    'Twin Falls County', 'Valley County', 'Washington County'
  ],
  'Illinois': [
    'Adams County', 'Bond County', 'Boone County', 'Brown County', 'Bureau County',
    'Calhoun County', 'Carroll County', 'Cass County', 'Champaign County', 'Christian County',
    'Clark County', 'Clay County', 'Clinton County', 'Coles County', 'Cook County',
    'Crawford County', 'Cumberland County', 'DeKalb County', 'De Witt County', 'Douglas County',
    'Du Page County', 'Edgar County', 'Edwards County', 'Effingham County', 'Fayette County',
    'Ford County', 'Franklin County', 'Fulton County', 'Gallatin County', 'Greene County',
    'Grundy County', 'Hamilton County', 'Hancock County', 'Hardin County', 'Henderson County',
    'Henry County', 'Iroquois County', 'Jackson County', 'Jasper County', 'Jefferson County',
    'Jersey County', 'Jo Daviess County', 'Johnson County', 'Kane County', 'Kankakee County',
    'Kendall County', 'Knox County', 'Lake County', 'LaSalle County', 'Lawrence County',
    'Lee County', 'Livingston County', 'Logan County', 'McDonough County', 'McHenry County',
    'McLean County', 'Macon County', 'Madison County', 'Marshall County', 'Mason County',
    'Massac County', 'Menard County', 'Monroe County', 'Montgomery County', 'Morgan County',
    'Moultrie County', 'Ogle County', 'Peoria County', 'Perry County', 'Piatt County',
    'Pike County', 'Pope County', 'Pulaski County', 'Putnam County', 'Randolph County',
    'Richland County', 'Rock Island County', 'St. Clair County', 'Saline County', 'Sangamon County',
    'Schuyler County', 'Scott County', 'Shelby County', 'Stark County', 'Stephenson County',
    'Tazewell County', 'Union County', 'Vermilion County', 'Wabash County', 'Warren County',
    'Washington County', 'Wayne County', 'White County', 'Whiteside County', 'Will County',
    'Williamson County', 'Winnebago County', 'Woodford County'
  ],
  'Indiana': [
    'Adams County', 'Allen County', 'Bartholomew County', 'Benton County', 'Blackford County',
    'Boone County', 'Brown County', 'Carroll County', 'Cass County', 'Clark County',
    'Clay County', 'Clinton County', 'Crawford County', 'Daviess County', 'Dearborn County',
    'Decatur County', 'DeKalb County', 'Delaware County', 'Dubois County', 'Elkhart County',
    'Fayette County', 'Floyd County', 'Fontaine County', 'Franklin County', 'Fulton County',
    'Gibson County', 'Grant County', 'Greene County', 'Hamilton County', 'Hancock County',
    'Harrison County', 'Hendricks County', 'Henry County', 'Howard County', 'Huntington County',
    'Jackson County', 'Jasper County', 'Jay County', 'Jefferson County', 'Jennings County',
    'Johnson County', 'Knox County', 'Kosciusko County', 'LaGrange County', 'Lake County',
    'LaPorte County', 'Lawrence County', 'Madison County', 'Marion County', 'Marshall County',
    'Martin County', 'Miami County', 'Monroe County', 'Montgomery County', 'Morgan County',
    'Newton County', 'Noble County', 'Ohio County', 'Orange County', 'Owen County',
    'Parke County', 'Perry County', 'Porter County', 'Posey County', 'Pulaski County',
    'Putnam County', 'Randolph County', 'Ripley County', 'Rush County', 'St. Joseph County',
    'Starke County', 'Steuben County', 'Sullivan County', 'Switzerland County', 'Tippecanoe County',
    'Tipton County', 'Union County', 'Vanderburgh County', 'Vermillion County', 'Vigo County',
    'Wabash County', 'Warren County', 'Warrick County', 'Washington County', 'Wayne County',
    'Wells County', 'White County', 'Whitley County'
  ],
  'Iowa': [
    'Adair County', 'Adams County', 'Allamakee County', 'Appanoose County', 'Audubon County',
    'Benton County', 'Black Hawk County', 'Boone County', 'Bremer County', 'Buchanan County',
    'Buena Vista County', 'Butler County', 'Calhoun County', 'Carroll County', 'Cass County',
    'Cedar County', 'Cerro Gordo County', 'Cherokee County', 'Chickasaw County', 'Clarke County',
    'Clay County', 'Clayton County', 'Clinton County', 'Crawford County', 'Dallas County',
    'Davis County', 'Decatur County', 'Delaware County', 'Des Moines County', 'Dickinson County',
    'Dubuque County', 'Emmet County', 'Fayette County', 'Floyd County', 'Franklin County',
    'Fremont County', 'Greene County', 'Grundy County', 'Guthrie County', 'Hamilton County',
    'Hancock County', 'Hardin County', 'Harrison County', 'Henry County', 'Howard County',
    'Humboldt County', 'Ida County', 'Iowa County', 'Jackson County', 'Jasper County',
    'Jefferson County', 'Johnson County', 'Jones County', 'Keokuk County', 'Kossuth County',
    'Lee County', 'Linn County', 'Louisa County', 'Lucas County', 'Lyon County',
    'Madison County', 'Mahaska County', 'Marion County', 'Marshall County', 'Mills County',
    'Mitchell County', 'Monona County', 'Monroe County', 'Montgomery County', 'Muscatine County',
    'OBrien County', 'Osceola County', 'Page County', 'Palo Alto County', 'Plymouth County',
    'Polk County', 'Pottawattamie County', 'Poweshiek County', 'Ringgold County', 'Sac County',
    'Scott County', 'Shelby County', 'Sioux County', 'Story County', 'Tama County',
    'Taylor County', 'Union County', 'Wapello County', 'Warren County', 'Washington County',
    'Wayne County', 'Webster County', 'Winnebago County', 'Winneshiek County', 'Woodbury County',
    'Worth County', 'Wright County'
  ],
  'Kansas': [
    'Allen County', 'Anderson County', 'Atchison County', 'Barber County', 'Barton County',
    'Bourbon County', 'Brown County', 'Butler County', 'Chase County', 'Chautauqua County',
    'Cherokee County', 'Cheyenne County', 'Clark County', 'Clay County', 'Cloud County',
    'Coffey County', 'Comanche County', 'Cowley County', 'Crawford County', 'Decatur County',
    'Dickinson County', 'Doniphan County', 'Douglas County', 'Edwards County', 'Elk County',
    'Ellis County', 'Ellsworth County', 'Finney County', 'Ford County', 'Franklin County',
    'Geary County', 'Gove County', 'Graham County', 'Grant County', 'Gray County',
    'Greeley County', 'Greenwood County', 'Hamilton County', 'Harper County', 'Harvey County',
    'Haskell County', 'Hodgeman County', 'Jackson County', 'Jefferson County', 'Jewell County',
    'Johnson County', 'Kearny County', 'Kingman County', 'Kiowa County', 'Labette County',
    'Lane County', 'Leavenworth County', 'Lincoln County', 'Linn County', 'Logan County',
    'Lyon County', 'Marion County', 'Marshall County', 'McPherson County', 'Meade County',
    'Miami County', 'Mitchell County', 'Montgomery County', 'Morris County', 'Morton County',
    'Nemaha County', 'Neosho County', 'Ness County', 'Osage County', 'Osborne County',
    'Ottawa County', 'Pawnee County', 'Phillips County', 'Pottawatomie County', 'Pratt County',
    'Rawlins County', 'Reno County', 'Republic County', 'Rice County', 'Riley County',
    'Rooks County', 'Rush County', 'Russell County', 'Saline County', 'Scott County',
    'Sedgwick County', 'Seward County', 'Shawnee County', 'Sheridan County', 'Sherman County',
    'Smith County', 'Stafford County', 'Stanton County', 'Stevens County', 'Thomas County',
    'Trego County', 'Wabaunsee County', 'Wallace County', 'Washington County', 'Wichita County',
    'Wilson County', 'Woodson County', 'Wyandotte County'
  ],
  'Kentucky': [
    'Adair County', 'Allen County', 'Anderson County', 'Bourbon County', 'Boyd County',
    'Bracken County', 'Breathitt County', 'Campbell County', 'Carter County', 'Clark County',
    'Clay County', ' Elliott County', 'Estill County', 'Fayette County', 'Fleming County',
    'Floyd County', 'Gallatin County', 'Garrard County', 'Grant County', 'Greenup County',
    'Harlan County', 'Harrison County', 'Jackson County', 'Jessamine County', 'Johnson County',
    'Kenton County', 'Knott County', 'Knox County', 'Laurel County', 'Lawrence County',
    'Lee County', 'Leslie County', 'Letcher County', 'Lewis County', 'Madison County',
    'Magoffin County', 'Martin County', 'Menifee County', 'Morgan County', 'Owsley County',
    'Pendleton County', 'Perry County', 'Powell County', 'Robertson County', 'Rockcastle County',
    'Rowan County', 'Wolfe County', 'Woodford County'
  ],
  'Louisiana': [
    'Acadia Parish', 'Allen Parish', 'Ascension Parish', 'Assumption Parish', 'Avoyelles Parish',
    'Beauregard Parish', 'Bienville Parish', 'Bossier Parish', 'Caddo Parish', 'Calcasieu Parish',
    'Caldwell Parish', 'Cameron Parish', 'Catahoula Parish', 'Claiborne Parish', 'Concordia Parish',
    'De Soto Parish', 'East Baton Rouge Parish', 'East Carroll Parish', 'East Feliciana Parish',
    'Evangeline Parish', 'Franklin Parish', 'Grant Parish', 'Iberia Parish', 'Iberville Parish',
    'Jackson Parish', 'Jefferson Parish', 'Jefferson Davis Parish', 'Lafayette Parish', 'Lafourche Parish',
    'LaSalle Parish', 'Lincoln Parish', 'Livingston Parish', 'Madison Parish', 'Morehouse Parish',
    'Natchitoches Parish', 'Orleans Parish', 'Ouachita Parish', 'Plaquemines Parish', 'Pointe Coupee Parish',
    'Rapides Parish', 'Red River Parish', 'Richland Parish', 'Sabine Parish', 'St. Bernard Parish',
    'St. Charles Parish', 'St. Helena Parish', 'St. James Parish', 'St. John the Baptist Parish',
    'St. Landry Parish', 'St. Martin Parish', 'St. Mary Parish', 'St. Tammany Parish', 'Tangipahoa Parish',
    'Tensas Parish', 'Terrebonne Parish', 'Union Parish', 'Vermilion Parish', 'Vernon Parish',
    'Washington Parish', 'West Baton Rouge Parish', 'West Carroll Parish', 'West Feliciana Parish',
    'Winn Parish'
  ],
  'Maine': [
    'Androscoggin County', 'Aroostook County', 'Cumberland County', 'Franklin County', 'Hancock County',
    'Kennebec County', 'Knox County', 'Lincoln County', 'Oxford County', 'Penobscot County',
    'Piscataquis County', 'Sagadahoc County', 'Somerset County', 'Waldo County', 'Washington County',
    'York County'
  ],
  'Maryland': [
    'Allegany County', 'Anne Arundel County', 'Baltimore City', 'Baltimore County', 'Calvert County',
    'Caroline County', 'Carroll County', 'Cecil County', 'Charles County', 'Dorchester County',
    'Frederick County', 'Garrett County', 'Harford County', 'Howard County', 'Kent County',
    'Montgomery County', 'Prince George\'s County', 'Queen Anne\'s County', 'St. Mary\'s County',
    'Somerset County', 'Talbot County', 'Washington County', 'Wicomico County', 'Worcester County'
  ],
  'Massachusetts': [
    'Barnstable County', 'Berkshire County', 'Bristol County', 'Dukes County', 'Essex County',
    'Franklin County', 'Hampden County', 'Hampshire County', 'Middlesex County', 'Nantucket County',
    'Norfolk County', 'Plymouth County', 'Suffolk County', 'Worcester County'
  ],
  'Michigan': [
    'Alcona County', 'Alger County', 'Allgan County', 'Alpena County', 'Antrim County',
    'Arenac County', 'Baraga County', 'Barry County', 'Bay County', 'Benzie County',
    'Berrien County', 'Branch County', 'Calhoun County', 'Cass County', 'Charlevoix County',
    'Cheboygan County', 'Chippewa County', 'Clare County', 'Clinton County', 'Crawford County',
    'Delta County', 'Dickinson County', 'Eaton County', 'Emmet County', 'Genesee County',
    'Gladwin County', 'Gogebic County', 'Grand Traverse County', 'Gratiot County', 'Houghton County',
    'Huron County', 'Ingham County', 'Ionia County', 'Iosco County', 'Iron County',
    'Isabella County', 'Jackson County', 'Kalamazoo County', 'Kalkaska County', 'Kent County',
    'Keweenaw County', 'Lake County', 'Lapeer County', 'Leelanau County', 'Lenawee County',
    'Livingston County', 'Luce County', 'Mackinac County', 'Macomb County', 'Manistee County',
    'Marquette County', 'Mason County', 'Mecosta County', 'Menominee County', 'Midland County',
    'Missaukee County', 'Monroe County', 'Montcalm County', 'Montmorency County', 'Muskegon County',
    'Newaygo County', 'Oakland County', 'Oceana County', 'Ogemaw County', 'Ontonagon County',
    'Osceola County', 'Oscoda County', 'Otsego County', 'Ottawa County', 'Presque Isle County',
    'Roscommon County', 'Saginaw County', 'St. Clair County', 'St. Joseph County', 'Sanilac County',
    'Schoolcraft County', 'Shiawassee County', 'Tuscola County', 'Van Buren County', 'Washtenaw County',
    'Wayne County', 'Wexford County'
  ],
  'Minnesota': [
    'Anoka County', 'Becker County', 'Beltrami County', 'Benton County', 'Big Stone County',
    'Blue Earth County', 'Brown County', 'Carlton County', 'Carver County', 'Cass County',
    'Chippewa County', 'Chisago County', 'Clay County', 'Clearwater County', 'Cook County',
    'Cottonwood County', 'Crow Wing County', 'Dakota County', 'Dodge County', 'Douglas County',
    'Faribault County', 'Fillmore County', 'Freeborn County', 'Goodhue County', 'Grant County',
    'Hennepin County', 'Houston County', 'Hubbard County', 'Isanti County', 'Itasca County',
    'Jackson County', 'Kanabec County', 'Kandiyohi County', 'Kittson County', 'Koochiching County',
    'Lac qui Parle County', 'Lake County', 'Lake of the Woods County', 'Le Sueur County', 'Lincoln County',
    'Lyon County', 'Mahnomen County', 'Marshall County', 'Martin County', 'McLeod County',
    'Meeker County', 'Mille Lacs County', 'Morrison County', 'Mower County', 'Murray County',
    'Nicollet County', 'Nobles County', 'Norman County', 'Olmsted County', 'Otter Tail County',
    'Pine County', 'Pipestone County', 'Polk County', 'Pope County', 'Ramsey County',
    'Red Lake County', 'Redwood County', 'Renville County', 'Rice County', 'Rock County',
    'Roseau County', 'Scott County', 'Sherburne County', 'Sibley County', 'Stearns County',
    'Steele County', 'Swift County', 'Todd County', 'Traverse County', 'Wabasha County',
    'Wadena County', 'Waseca County', 'Washington County', 'Watonwan County', 'Wilkin County',
    'Winona County', 'Wright County', 'Yellow Medicine County'
  ],
  'Mississippi': [
    'Adams County', 'Alcorn County', 'Amite County', 'Attala County', 'Benton County',
    'Bolivar County', 'Calhoun County', 'Carroll County', 'Chickasaw County', 'Choctaw County',
    'Claiborne County', 'Clarke County', 'Clay County', 'Coahoma County', 'Copiah County',
    'Covington County', 'DeSoto County', 'Forrest County', 'Franklin County', 'George County',
    'Greene County', 'Grenada County', 'Hancock County', 'Harrison County', 'Hinds County',
    'Holmes County', 'Issaquena County', 'Itawamba County', 'Jackson County', 'Jasper County',
    'Jefferson County', 'Jefferson Davis County', 'Jones County', 'Kemper County', 'Lafayette County',
    'Lamar County', 'Lauderdale County', 'Lawrence County', 'Leake County', 'Leflore County',
    'Marshall County', 'Monroe County', 'Montgomery County', 'Neshoba County', 'Newton County',
    'Noxubee County', 'Oktibbeha County', 'Panola County', 'Pearl River County', 'Perry County',
    'Pike County', 'Pontotoc County', 'Prentiss County', 'Quitman County', 'Rankin County',
    'Scott County', 'Sharkey County', 'Simpson County', 'Smith County', 'Stone County',
    'Sunflower County', 'Tallahatchie County', 'Tate County', 'Tippah County', 'Tishomingo County',
    'Tunica County', 'Walthall County', 'Warren County', 'Washington County', 'Wayne County',
    'Webster County', 'Wilkinson County', 'Winston County', 'Yalobusha County', 'Yazoo County'
  ],
  'Missouri': [
    'Adair County', 'Andrew County', 'Atchison County', 'Audrain County', 'Barry County',
    'Barton County', 'Bates County', 'Benton County', 'Bollinger County', 'Boone County',
    'Buchanan County', 'Butler County', 'Caldwell County', 'Callaway County', 'Camden County',
    'Cape Girardeau County', 'Carroll County', 'Carter County', 'Cass County', 'Cedar County',
    'Chariton County', 'Christian County', 'Clark County', 'Clay County', 'Clinton County',
    'Cole County', 'Cooper County', 'Crawford County', 'Dade County', 'Dallas County',
    'Daviess County', 'DeKalb County', 'Dent County', 'Douglas County', 'Dunklin County',
    'Franklin County', 'Gasconade County', 'Gentry County', 'Greene County', 'Grundy County',
    'Harrison County', 'Henry County', 'Hickory County', 'Holt County', 'Howard County',
    'Howell County', 'Iron County', 'Jackson County', 'Jasper County', 'Jefferson County',
    'Johnson County', 'Knox County', 'Laclede County', 'Lafayette County', 'Lawrence County',
    'Lewis County', 'Lincoln County', 'Linn County', 'Livingston County', 'Macon County',
    'Madison County', 'Maries County', 'Marion County', 'McDonald County', 'Moniteau County',
    'Monroe County', 'Montgomery County', 'Morgan County', 'New Madrid County', 'Newton County',
    'Nodaway County', 'Oregon County', 'Osage County', 'Ozark County', 'Pemiscot County',
    'Perry County', 'Pettis County', 'Phelps County', 'Pike County', 'Platte County',
    'Polk County', 'Pulaski County', 'Ralls County', 'Randolph County', 'Ray County',
    'Reynolds County', 'Ripley County', 'St. Charles County', 'St. Clair County', 'St. Francois County',
    'St. Louis County', 'Ste. Genevieve County', 'Stoddard County', 'Stone County', 'Sullivan County',
    'Taney County', 'Texas County', 'Vernon County', 'Warren County', 'Washington County',
    'Wayne County', 'Webster County', 'Worth County', 'Wright County'
  ],
  'Montana': [
    'Beaverhead County', 'Big Horn County', 'Blaine County', 'Broadwater County', 'Carbon County',
    'Carter County', 'Cascade County', 'Chouteau County', 'Custer County', 'Daniels County',
    'Dawson County', 'Deer Lodge County', 'Fallon County', 'Fergus County', 'Flathead County',
    'Gallatin County', 'Garfield County', 'Glacier County', 'Golden Valley County', 'Granite County',
    'Hill County', 'Jefferson County', 'Judith Basin County', 'Lake County', 'Lewis and Clark County',
    'Liberty County', 'Lincoln County', 'McCone County', 'Madison County', 'Meagher County',
    'Mineral County', 'Missoula County', 'Musselshell County', 'Petroleum County', 'Phillips County',
    'Pondera County', 'Powder River County', 'Powell County', 'Richland County', 'Roosevelt County',
    'Rosebud County', 'Sanders County', 'Sheridan County', 'Silver Bow County', 'Stillwater County',
    'Sweet Grass County', 'Teton County', 'Toole County', 'Treasure County', 'Valley County',
    'Wheatland County', 'Yellowstone County'
  ],
  'Nebraska': [
    'Adams County', 'Antelope County', 'Arthur County', 'Banner County', 'Blaine County',
    'Boone County', 'Box Butte County', 'Boyd County', 'Brown County', 'Buffalo County',
    'Burt County', 'Butler County', 'Cass County', 'Cedar County', 'Chase County',
    'Cherry County', 'Cheyenne County', 'Clay County', 'Colfax County', 'Cuming County',
    'Custer County', 'Dakota County', 'Dawes County', 'Dawson County', 'Deuel County',
    'Dixon County', 'Dodge County', 'Douglas County', 'Fillmore County', 'Franklin County',
    'Frontier County', 'Furnas County', 'Gage County', 'Garden County', 'Garfield County',
    'Gosper County', 'Grant County', 'Greeley County', 'Hall County', 'Harlan County',
    'Hitchcock County', 'Holt County', 'Hooker County', 'Howard County', 'Jefferson County',
    'Johnson County', 'Kearney County', 'Keith County', 'Keya Paha County', 'Kimball County',
    'Knox County', 'Lancaster County', 'Lincoln County', 'Logan County', 'Loup County',
    'McPherson County', 'Madison County', 'Merrick County', 'Morrill County', 'Nance County',
    'Nuckolls County', 'Otoe County', 'Pawnee County', 'Perkins County', 'Phelps County',
    'Pierce County', 'Platte County', 'Polk County', 'Red Willow County', 'Richardson County',
    'Rock County', 'Saline County', 'Sarpy County', 'Saunders County', 'Scotts Bluff County',
    'Seward County', 'Sheridan County', 'Sherman County', 'Sioux County', 'Stanton County',
    'Thayer County', 'Thomas County', 'Thurston County', 'Valley County', 'Washington County',
    'Wayne County', 'Webster County', 'Wheeler County', 'York County'
  ],
  'Nevada': [
    'Carson City', 'Churchill County', 'Clark County', 'Douglas County', 'Elko County',
    'Esmeralda County', 'Eureka County', 'Humboldt County', 'Lander County', 'Lincoln County',
    'Lyon County', 'Mineral County', 'Nye County', 'Pershing County', 'Storey County',
    'Washoe County', 'White Pine County'
  ],
  'New Hampshire': [
    'Belknap County', 'Carroll County', 'Cheshire County', 'Coos County', 'Grafton County',
    'Hillsborough County', 'Merrimack County', 'Rockingham County', 'Strafford County',
    'Sullivan County'
  ],
  'New Jersey': [
    'Atlantic County', 'Bergen County', 'Burlington County', 'Camden County', 'Cape May County',
    'Cumberland County', 'Essex County', 'Gloucester County', 'Hudson County', 'Hunterdon County',
    'Mercer County', 'Middlesex County', 'Monmouth County', 'Morris County', 'Ocean County',
    'Passaic County', 'Salem County', 'Somerset County', 'Sussex County', 'Union County',
    'Warren County'
  ],
  'New Mexico': [
    'Bernalillo County', 'Catron County', 'Chaves County', 'Cibola County', 'Colfax County',
    'Curry County', 'De Baca County', 'Dona Ana County', 'Eddy County', 'Grant County',
    'Guadalupe County', 'Harding County', 'Hidalgo County', 'Lea County', 'Lincoln County',
    'Los Alamos County', 'Luna County', 'McKinley County', 'Mora County', 'Otero County',
    'Quay County', 'Rio Arriba County', 'Roosevelt County', 'Sandoval County', 'San Juan County',
    'San Miguel County', 'Santa Fe County', 'Sierra County', 'Socorro County', 'Taos County',
    'Torrance County', 'Union County', 'Valencia County'
  ],
  'New York': [
    'Albany County', 'Allegany County', 'Bronx County', 'Broome County', 'Cattaraugus County',
    'Cayuga County', 'Chautauqua County', 'Chemung County', 'Chenango County', 'Clinton County',
    'Columbia County', 'Cortland County', 'Delaware County', 'Dutchess County', 'Erie County',
    'Essex County', 'Franklin County', 'Fulton County', 'Genesee County', 'Greene County',
    'Hamilton County', 'Herkimer County', 'Jefferson County', 'Kings County', 'Lewis County',
    'Livingston County', 'Madison County', 'Monroe County', 'Montgomery County', 'Nassau County',
    'New York County', 'Ontario County', 'Orange County', 'Orleans County', 'Oswego County',
    'Otsego County', 'Putnam County', 'Rensselaer County', 'Richmond County', 'Rockland County',
    'St. Lawrence County', 'Saratoga County', 'Schenectady County', 'Schoharie County', 'Schuyler County',
    'Seneca County', 'Steuben County', 'Suffolk County', 'Sullivan County', 'Tioga County',
    'Tompkins County', 'Ulster County', 'Warren County', 'Washington County', 'Wayne County',
    'Westchester County', 'Wyoming County', 'Yates County'
  ],
  'North Carolina': [
    'Alamance County', 'Alexander County', 'Alleghany County', 'Anson County', 'Ashe County',
    'Avery County', 'Beaufort County', 'Bertie County', 'Bladen County', 'Brunswick County',
    'Buncombe County', 'Burke County', 'Cabarrus County', 'Caldwell County', 'Camden County',
    'Carteret County', 'Caswell County', 'Catawba County', 'Chatham County', 'Cherokee County',
    'Chowan County', 'Clay County', 'Cleveland County', 'Columbus County', 'Craven County',
    'Cumberland County', 'Currituck County', 'Dare County', 'Davidson County', 'Davie County',
    'Duplin County', 'Durham County', 'Edgecombe County', 'Forsyth County', 'Franklin County',
    'Gaston County', 'Gates County', 'Graham County', 'Granville County', 'Greene County',
    'Guilford County', 'Halifax County', 'Harnett County', 'Haywood County', 'Henderson County',
    'Hertford County', 'Hoke County', 'Iredell County', 'Jackson County', 'Johnston County',
    'Jones County', 'Lee County', 'Lenoir County', 'Lincoln County', 'McDowell County',
    'Macon County', 'Madison County', 'Martin County', 'Mcdowell County', 'Mecklenburg County',
    'Mitchell County', 'Montgomery County', 'Moore County', 'Nash County', 'New Hanover County',
    'Northampton County', 'Onslow County', 'Orange County', 'Pamlico County', 'Pasquotank County',
    'Pender County', 'Perquimans County', 'Person County', 'Pitt County', 'Polk County',
    'Randolph County', 'Richmond County', 'Robeson County', 'Rockingham County', 'Rowan County',
    'Rutherford County', 'Sampson County', 'Scotland County', 'Stanly County', 'Stokes County',
    'Surry County', 'Swain County', 'Transylvania County', 'Tyrrell County', 'Union County',
    'Vance County', 'Wake County', 'Warren County', 'Washington County', 'Watauga County',
    'Wayne County', 'Wilkes County', 'Wilson County', 'Yadkin County', 'Yancey County'
  ],
  'North Dakota': [
    'Adams County', 'Barnes County', 'Benson County', 'Billings County', 'Bottineau County',
    'Bowman County', 'Burke County', 'Burleigh County', 'Cass County', 'Cavalier County',
    'Dickey County', 'Divide County', 'Dunn County', 'Eddy County', 'Emmons County',
    'Foster County', 'Golden Valley County', 'Grand Forks County', 'Grant County', 'Griggs County',
    'Hettinger County', 'Kidder County', 'LaMoure County', 'Logan County', 'McHenry County',
    'McIntosh County', 'McKenzie County', 'McLean County', 'Mercer County', 'Morton County',
    'Mountrail County', 'Nelson County', 'Oliver County', 'Pembina County', 'Pierce County',
    'Ramsey County', 'Ransom County', 'Renville County', 'Richland County', 'Rolette County',
    'Sargent County', 'Sheridan County', 'Sioux County', 'Slope County', 'Stark County',
    'Steele County', 'Stutsman County', 'Towner County', 'Traill County', 'Wells County',
    'Williams County'
  ],
  'Ohio': [
    'Adams County', 'Allen County', 'Ashland County', 'Ashtabula County', 'Athens County',
    'Auglaize County', 'Belmont County', 'Brown County', 'Butler County', 'Carroll County',
    'Champaign County', 'Clark County', 'Clermont County', 'Clinton County', 'Columbiana County',
    'Coshocton County', 'Crawford County', 'Cuyahoga County', 'Darke County', 'Defiance County',
    'Delaware County', 'Erie County', 'Fairfield County', 'Fayette County', 'Franklin County',
    'Gallia County', 'Geauga County', 'Greene County', 'Guernsey County', 'Hamilton County',
    'Hancock County', 'Hardin County', 'Harrison County', 'Henry County', 'Highland County',
    'Hocking County', 'Holmes County', 'Huron County', 'Jackson County', 'Jefferson County',
    'Knox County', 'Lake County', 'Lawrence County', 'Licking County', 'Logan County',
    'Lorain County', 'Lucas County', 'Madison County', 'Mahoning County', 'Marion County',
    'Medina County', 'Meigs County', 'Montgomery County', 'Morgan County', 'Morrow County',
    'Muskingum County', 'Noble County', 'Ottawa County', 'Perry County', 'Pickaway County',
    'Pike County', 'Portage County', 'Preble County', 'Putnam County', 'Richland County',
    'Ross County', 'Sandusky County', 'Scioto County', 'Seneca County', 'Shelby County',
    'Stark County', 'Summit County', 'Trumbull County', 'Tuscarawas County', 'Union County',
    'Van Wert County', 'Vinton County', 'Warren County', 'Washington County', 'Wayne County',
    'Williams County', 'Wood County', 'Wyandot County'
  ],
  'Oklahoma': [
    'Beaver County', 'Beckham County', 'Blaine County', 'Bryan County', 'Caddo County',
    'Canadian County', 'Carter County', 'Cherokee County', 'Choctaw County', 'Cimarron County',
    'Cleveland County', 'Coal County', 'Comanche County', 'Cotton County', 'Craig County',
    'Creek County', 'Custer County', 'Delaware County', 'Dewey County', 'Ellis County',
    'Garfield County', 'Garvin County', 'Grady County', 'Grant County', 'Greer County',
    'Harmon County', 'Harper County', 'Haskell County', 'Hughes County', 'Jackson County',
    'Jefferson County', 'Johnston County', 'Kay County', 'Kingfisher County', 'Kiowa County',
    'Latimer County', 'Le Flore County', 'Lincoln County', 'Logan County', 'Love County',
    'Major County', 'Marshall County', 'Mayes County', 'Murray County', 'Muskogee County',
    'Noble County', 'Nowata County', 'Okfuskee County', 'Oklahoma County', 'Okmulgee County',
    'Osage County', 'Ottawa County', 'Pawnee County', 'Payne County', 'Pittsburgh County',
    'Pontotoc County', 'Pottawatomie County', 'Pushmataha County', 'Roger Mills County', 'Rogers County',
    'Seminole County', 'Sequoyah County', 'Stephens County', 'Texas County', 'Tillman County',
    'Tulsa County', 'Wagoner County', 'Washington County', 'Washita County', 'Woodward County'
  ],
  'Oregon': [
    'Baker County', 'Benton County', 'Clackamas County', 'Clatsop County', 'Columbia County',
    'Coos County', 'Crook County', 'Curry County', 'Deschutes County', 'Douglas County',
    'Gilliam County', 'Grant County', 'Harney County', 'Hood River County', 'Jackson County',
    'Jefferson County', 'Josephine County', 'Klamath County', 'Lake County', 'Lane County',
    'Lincoln County', 'Linn County', 'Malheur County', 'Marion County', 'Morrow County',
    'Multnomah County', 'Polk County', 'Sherman County', 'Tillamook County', 'Umatilla County',
    'Union County', 'Wallowa County', 'Wasco County', 'Washington County', 'Wheeler County',
    'Yamhill County'
  ],
  'Pennsylvania': [
    'Adams County', 'Allegheny County', 'Armstrong County', 'Beaver County', 'Bedford County',
    'Berks County', 'Blair County', 'Bradford County', 'Bucks County', 'Butler County',
    'Cambria County', 'Cameron County', 'Carbon County', 'Centre County', 'Chester County',
    'Clarion County', 'Clearfield County', 'Clinton County', 'Columbia County', 'Crawford County',
    'Cumberland County', 'Dauphin County', 'Delaware County', 'Elk County', 'Erie County',
    'Fayette County', 'Forest County', 'Franklin County', 'Fulton County', 'Greene County',
    'Huntingdon County', 'Indiana County', 'Jefferson County', 'Juniata County', 'Lackawanna County',
    'Lancaster County', 'Lawrence County', 'Lebanon County', 'Lehigh County', 'Luzerne County',
    'Lycoming County', 'Monroe County', 'Montgomery County', 'Montour County', 'Northampton County',
    'Northumberland County', 'Perry County', 'Philadelphia County', 'Pike County', 'Potter County',
    'Schuylkill County', 'Snyder County', 'Somerset County', 'Sullivan County', 'Susquehanna County',
    'Tioga County', 'Union County', 'Venango County', 'Warren County', 'Washington County',
    'Wayne County', 'Westmoreland County', 'Wyoming County', 'York County'
  ],

  'Rhode Island': [
    'Bristol County', 'Kent County', 'Newport County', 'Providence County', 'Washington County'
  ],

  'South Carolina': [
    'Abbeville County', 'Aiken County', 'Allendale County', 'Anderson County', 'Bamberg County',
    'Barnwell County', 'Beaufort County', 'Berkeley County', 'Calhoun County', 'Charleston County',
    'Cherokee County', 'Chester County', 'Chesterfield County', 'Clarendon County', 'Colleton County',
    'Darlington County', 'Dillon County', 'Dorchester County', 'Edgefield County', 'Fairfield County',
    'Florence County', 'Georgetown County', 'Greenville County', 'Greenwood County', 'Hampton County',
    'Horry County', 'Jasper County', 'Kershaw County', 'Lancaster County', 'Laurens County',
    'Lee County', 'Lexington County', 'McCormick County', 'Newberry County', 'Oconee County',
    'Orangeburg County', 'Pickens County', 'Richland County', 'Saluda County', 'Spartanburg County',
    'Sumter County', 'Union County', 'Williamsburg County', 'York County'
  ],

  'South Dakota': [
    'Aurora County', 'Beadle County', 'Bennett County', 'Bon Homme County', 'Brookings County',
    'Brown County', 'Brule County', 'Buffalo County', 'Campbell County', 'Charles Mix County',
    'Clark County', 'Clay County', 'Codington County', 'Corson County', 'Custer County',
    'Davison County', 'Day County', 'Deuel County', 'Dewey County', 'Douglas County',
    'Edmunds County', 'Fall River County', 'Faulk County', 'Grant County', 'Gregory County',
    'Haakon County', 'Hamlin County', 'Hand County', 'Hanson County', 'Harding County',
    'Hughes County', 'Hutchinson County', 'Jackson County', 'Jerauld County', 'Jones County',
    'Kingsbury County', 'Lake County', 'Lawrence County', 'Lincoln County', 'Lyman County',
    'McCook County', 'McPherson County', 'Marion County', 'Marshall County', 'Mellette County',
    'Miner County', 'Minnehaha County', 'Moody County', 'Oglala Lakota County', 'Pennington County',
    'Perkins County', 'Potter County', 'Roberts County', 'Sanborn County', 'Shannon County',
    'Spink County', 'Stanley County', 'Sully County', 'Todd County', 'Tripp County',
    'Turner County', 'Union County', 'Walworth County', 'Yankton County', 'Ziebach County'
  ],

  'Tennessee': [
    'Anderson County', 'Bedford County', 'Benton County', 'Bledsoe County', 'Blount County',
    'Bradley County', 'Campbell County', 'Cannon County', 'Carroll County', 'Carter County',
    'Cheatham County', 'Chester County', 'Claiborne County', 'Clay County', 'Cocke County',
    'Coffee County', 'Davidson County', 'Decatur County', 'DeKalb County', 'Dickson County',
    'Dyer County', 'Fayette County', 'Fentress County', 'Franklin County', 'Gibson County',
    'Giles County', 'Grainger County', 'Greene County', 'Grundy County', 'Hamblen County',
    'Hamilton County', 'Hancock County', 'Hardeman County', 'Hardin County', 'Hawkins County',
    'Haywood County', 'Henderson County', 'Henry County', 'Hickman County', 'Houston County',
    'Humphreys County', 'Jackson County', 'Jefferson County', 'Johnson County', 'Knox County',
    'Lake County', 'Lauderdale County', 'Lawrence County', 'Lewis County', 'Lincoln County',
    'Loudon County', 'McMinn County', 'McNairy County', 'Macon County', 'Madison County',
    'Marion County', 'Marshall County', 'Maury County', 'Meigs County', 'Monroe County',
    'Montgomery County', 'Moore County', 'Morgan County', 'Obion County', 'Overton County',
    'Perry County', 'Pickett County', 'Polk County', 'Putnam County', 'Rhea County',
    'Roane County', 'Robertson County', 'Rutherford County', 'Scott County', 'Sequatchie County',
    'Sevier County', 'Shelby County', 'Smith County', 'Stewart County', 'Sullivan County',
    'Sumner County', 'Tipton County', 'Trousdale County', 'Unicoi County', 'Union County',
    'Van Buren County', 'Warren County', 'Washington County', 'Wayne County', 'Weakley County',
    'White County', 'Williamson County', 'Wilson County'
  ],

  'Texas': [
    'Anderson County', 'Andrews County', 'Angelina County', 'Aransas County', 'Archer County',
    'Armstrong County', 'Atascosa County', 'Austin County', 'Bailey County', 'Bandera County',
    'Bastrop County', 'Baylor County', 'Bee County', 'Bell County', 'Bexar County',
    'Blanco County', 'Bowie County', 'Brazoria County', 'Brazos County', 'Brewster County',
    'Briscoe County', 'Brooks County', 'Brown County', 'Burleson County', 'Burnet County',
    'Caldwell County', 'Calhoun County', 'Callahan County', 'Cameron County', 'Camp County',
    'Carson County', 'Cass County', 'Castro County', 'Chambers County', 'Cherokee County',
    'Childress County', 'Clay County', 'Cochran County', 'Coke County', 'Coleman County',
    'Collin County', 'Collingsworth County', 'Colorado County', 'Comal County', 'Comanche County',
    'Concho County', 'Cooke County', 'Coryell County', 'Crane County', 'Crockett County',
    'Crosby County', 'Dallas County', 'Dawson County', 'Deaf Smith County', 'Delta County',
    'Denton County', 'DeWitt County', 'Dickens County', 'Dimmit County', 'Donley County',
    'Duval County', 'Eastland County', 'Ector County', 'Edwards County', 'El Paso County',
    'Ellis County', 'Erath County', 'Falls County', 'Fannin County', 'Fayette County',
    'Fisher County', 'Floyd County', 'Foard County', 'Fort Bend County', 'Franklin County',
    'Freestone County', 'Gaines County', 'Galveston County', 'Garza County', 'Gillespie County',
    'Glasscock County', 'Goliad County', 'Gonzales County', 'Gray County', 'Grayson County',
    'Gregg County', 'Grimes County', 'Guadalupe County', 'Hale County', 'Hall County',
    'Hamilton County', 'Hansford County', 'Hardeman County', 'Hardin County', 'Harris County',
    'Harrison County', 'Hartley County', 'Haskell County', 'Hays County', 'Hemphill County',
    'Henderson County', 'Hidalgo County', 'Hill County', 'Hockley County', 'Hood County',
    'Hopkins County', 'Houston County', 'Howard County', 'Hudspeth County', 'Hunt County',
    'Hutchinson County', 'Irion County', 'Jack County', 'Jackson County', 'Jasper County',
    'Jeff Davis County', 'Jefferson County', 'Jim Hogg County', 'Jim Wells County', 'Johnson County',
    'Jones County', 'Karnes County', 'Kaufman County', 'Kendall County', 'Kenedy County',
    'Kent County', 'Kimble County', 'King County', 'Kinney County', 'Kleberg County',
    'Knox County', 'Lamar County', 'Lamb County', 'Lampasas County', 'LaSalle County',
    'Lavaca County', 'Lee County', 'Leon County', 'Liberty County', 'Limestone County',
    'Lipscomb County', 'Live Oak County', 'Llano County', 'Loving County', 'Lubbock County',
    'Lynn County', 'McCulloch County', 'McLennan County', 'McMullen County', 'Madison County',
    'Marion County', 'Martin County', 'Mason County', 'Matagorda County', 'Maverick County',
    'Medina County', 'Menard County', 'Midland County', 'Milam County', 'Mills County',
    'Mitchell County', 'Montague County', 'Montgomery County', 'Moore County', 'Morris County',
    'Motley County', 'Nacogdoches County', 'Navarro County', 'Newton County', 'Nolan County',
    'Nueces County', 'Ochiltree County', 'Oldham County', 'Orange County', 'Palo Pinto County',
    'Panola County', 'Parker County', 'Parmer County', 'Pecos County', 'Polk County',
    'Potter County', 'Presidio County', 'Rains County', 'Randall County', 'Reagan County',
    'Real County', 'Red River County', 'Robertson County', 'Rockwall County', 'Runnels County',
    'Rusk County', 'Sabine County', 'San Augustine County', 'San Jacinto County', 'San Patricio County',
    'San Saba County', 'Schleicher County', 'Scurry County', 'Shackelford County', 'Shelby County',
    'Sherman County', 'Smith County', 'Somervell County', 'Starr County', 'Stephens County',
    'Sterling County', 'Stonewall County', 'Sutton County', 'Swisher County', 'Tarrant County',
    'Taylor County', 'Terrell County', 'Terry County', 'Throckmorton County', 'Titus County',
    'Tom Green County', 'Travis County', 'Trinity County', 'Tyler County', 'Upshur County',
    'Upton County', 'Uvalde County', 'Val Verde County', 'Van Zandt County', 'Victoria County',
    'Walker County', 'Waller County', 'Ward County', 'Washington County', 'Webb County',
    'Wharton County', 'Wheeler County', 'Williamson County', 'Wilson County', 'Winkler County',
    'Wise County', 'Wood County', 'Yoakum County', 'Young County', 'Zapata County', 'Zavala County'
  ],

  'Utah': [
    'Beaver County', 'Box Elder County', 'Cache County', 'Carbon County', 'Daggett County',
    'Davis County', 'Juab County', 'Kane County', 'Millard County', 'Morgan County',
    'Piute County', 'Rich County', 'Salt Lake County', 'San Juan County', 'Sanpete County',
    'Sevier County', 'Summit County', 'Tooele County', 'Uintah County', 'Utah County',
    'Wasatch County', 'Washington County', 'Wayne County', 'Weber County'
  ],

  'Vermont': [
    'Addison County', 'Bennington County', 'Caledonia County', 'Chittenden County', 'Essex County',
    'Franklin County', 'Grand Isle County', 'Lamoille County', 'Orange County', 'Orleans County',
    'Rutland County', 'Washington County', 'Windsor County', 'Windham County'
  ],

  'Virginia': [
    'Accomack County', 'Albemarle County', 'Alleghany County', 'Amelia County', 'Amherst County',
    'Appomattox County', 'Arlington County', 'Augusta County', 'Bath County', 'Bedford County',
    'Bland County', 'Botetourt County', 'Brunswick County', 'Buchanan County', 'Buckingham County',
    'Campbell County', 'Caroline County', 'Carroll County', 'Charles City County', 'Charlotte County',
    'Cherokee County', 'Clarke County', 'Craig County', 'Culpeper County', 'Dallas County',
    'Dickenson County', 'Dinwiddie County', 'Essex County', 'Fairfax County', 'Fauquier County',
    'Floyd County', 'Fluvanna County', 'Franklin County', 'Frederick County', 'Giles County',
    'Gloucester County', 'Goode County', 'Greene County', 'Greensville County', 'Grayson County',
    'Green County', 'Halifax County', 'Hanover County', 'Harrisonburg County', 'Henrico County',
    'Henry County', 'Highland County', 'Isle of Wight County', 'James City County', 'King and Queen County',
    'King George County', 'King William County', 'Lancaster County', 'Lee County', 'Loudoun County',
    'Louisa County', 'Madison County', 'Mathews County', 'Mecklenburg County', 'Middlesex County',
    'Montgomery County', 'Nelson County', 'New Kent County', 'Northampton County', 'Northumberland County',
    'Nottoway County', 'Orange County', 'Page County', 'Patrick County', 'Pittsylvania County',
    'Powhatan County', 'Prince Edward County', 'Prince George County', 'Prince William County',
    'Pulaski County', 'Rappahannock County', 'Richmond County', 'Roanoke County', 'Rockbridge County',
    'Rockingham County', 'Russell County', 'Scott County', 'Shenandoah County', 'Smyth County',
    'Southampton County', 'Spotsylvania County', 'Stafford County', 'Surry County', 'Sussex County',
    'Tazewell County', 'Warren County', 'Washington County', 'Westmoreland County', 'Wise County',
    'Wythe County', 'York County'
  ],

  'Washington': [
    'Adams County', 'Asotin County', 'Benton County', 'Chelan County', 'Clallam County',
    'Clark County', 'Columbia County', 'Cowlitz County', 'Douglas County', 'Ferry County',
    'Franklin County', 'Garfield County', 'Grant County', 'Grays Harbor County', 'Island County',
    'Jefferson County', 'King County', 'Kitsap County', 'Kittitas County', 'Klickitat County',
    'Lewis County', 'Lincoln County', 'Mason County', 'Okanogan County', 'Pacific County',
    'Pend Oreille County', 'Pierce County', 'San Juan County', 'Skagit County', 'Skamania County',
    'Snohomish County', 'Spokane County', 'Stevens County', 'Thurston County', 'Wahkiakum County',
    'Walla Walla County', 'Whatcom County', 'Whitman County', 'Yakima County'
  ],

  'West Virginia': [
    'Barbour County', 'Berkeley County', 'Boone County', 'Braxton County', 'Brooke County',
    'Cabell County', 'Clay County', 'Doddridge County', 'Fayette County', 'Gilmer County',
    'Grant County', 'Greenbrier County', 'Hampshire County', 'Hancock County', 'Hardy County',
    'Harrison County', 'Jackson County', 'Jefferson County', 'Kanawha County', 'Lewis County',
    'Lincoln County', 'Logan County', 'Marion County', 'Marshall County', 'Mason County',
    'McDowell County', 'Mercer County', 'Mineral County', 'Mingo County', 'Monongalia County',
    'Monroe County', 'Morgan County', 'Nicholas County', 'Ohio County', 'Pendleton County',
    'Pleasants County', 'Pocahontas County', 'Preston County', 'Putnam County', 'Raleigh County',
    'Randolph County', 'Ritchie County', 'Roane County', 'Summers County', 'Taylor County',
    'Tucker County', 'Tyler County', 'Upshur County', 'Wayne County', 'Webster County',
    'Wetzel County', 'Wirt County', 'Wood County'
  ],

  'Wisconsin': [
    'Adams County', 'Ashland County', 'Barron County', 'Bayfield County', 'Brown County',
    'Buffalo County', 'Burnett County', 'Calumet County', 'Chippewa County', 'Clark County',
    'Columbia County', 'Crawford County', 'Dane County', 'Dodge County', 'Door County',
    'Douglas County', 'Dunn County', 'Eau Claire County', 'Florence County', 'Fond du Lac County',
    'Forest County', 'Grant County', 'Green County', 'Green Lake County', 'Iowa County',
    'Iron County', 'Jackson County', 'Jefferson County', 'Juneau County', 'Kenosha County',
    'Kewaunee County', 'La Crosse County', 'Lafayette County', 'Langlade County', 'Lincoln County',
    'Manitowoc County', 'Marathon County', 'Marinette County', 'Menominee County', 'Milwaukee County',
    'Monroe County', 'Oconto County', 'Oneida County', 'Outagamie County', 'Ozaukee County',
    'Pepin County', 'Pierce County', 'Polk County', 'Portage County', 'Price County',
    'Racine County', 'Richland County', 'Rock County', 'Rusk County', 'Sauk County',
    'Sawyer County', 'Shawano County', 'Sheboygan County', 'Taylor County', 'Trempealeau County',
    'Vernon County', 'Vilas County', 'Walworth County', 'Washburn County', 'Washington County',
    'Waukesha County', 'Waupaca County', 'Waushara County', 'Winnebago County', 'Wood County'
  ],

  'Wyoming': [
    'Albany County', 'Big Horn County', 'Campbell County', 'Carbon County', 'Converse County',
    'Crook County', 'Fremont County', 'Goshen County', 'Hot Springs County', 'Johnson County',
    'Laramie County', 'Lincoln County', 'Natrona County', 'Niobrara County', 'Park County',
    'Platte County', 'Sheridan County', 'Sublette County', 'Sweetwater County', 'Teton County',
    'Uinta County', 'Washakie County', 'Weston County'
  ]
};

export const routeToStateMap: { [key: string]: string } = {
  al: 'Alabama',
  ak: 'Alaska',
  az: 'Arizona',
  ar: 'Arkansas',
  ca: 'California',
  co: 'Colorado',
  ct: 'Connecticut',
  de: 'Delaware',
  fl: 'Florida',
  ga: 'Georgia',
  hi: 'Hawaii',
  id: 'Idaho',
  il: 'Illinois',
  in: 'Indiana',
  ia: 'Iowa',
  ks: 'Kansas',
  ky: 'Kentucky',
  la: 'Louisiana',
  me: 'Maine',
  md: 'Maryland',
  ma: 'Massachusetts',
  mi: 'Michigan',
  mn: 'Minnesota',
  ms: 'Mississippi',
  mo: 'Missouri',
  mt: 'Montana',
  ne: 'Nebraska',
  nv: 'Nevada',
  nh: 'New Hampshire',
  nj: 'New Jersey',
  nm: 'New Mexico',
  ny: 'New York',
  nc: 'North Carolina',
  nd: 'North Dakota',
  oh: 'Ohio',
  ok: 'Oklahoma',
  or: 'Oregon',
  pa: 'Pennsylvania',
  ri: 'Rhode Island',
  sc: 'South Carolina',
  sd: 'South Dakota',
  tn: 'Tennessee',
  tx: 'Texas',
  ut: 'Utah',
  vt: 'Vermont',
  va: 'Virginia',
  wa: 'Washington',
  wv: 'West Virginia',
  wi: 'Wisconsin',
  wy: 'Wyoming',
};

export const stateAbbreviations: { [key: string]: string } = {
  'Alabama': 'AL',
  'Alaska': 'AK',
  'Arizona': 'AZ',
  'Arkansas': 'AR',
  'California': 'CA',
  'Colorado': 'CO',
  'Connecticut': 'CT',
  'Delaware': 'DE',
  'Florida': 'FL',
  'Georgia': 'GA',
  'Hawaii': 'HI',
  'Idaho': 'ID',
  'Illinois': 'IL',
  'Indiana': 'IN',
  'Iowa': 'IA',
  'Kansas': 'KS',
  'Kentucky': 'KY',
  'Louisiana': 'LA',
  'Maine': 'ME',
  'Maryland': 'MD',
  'Massachusetts': 'MA',
  'Michigan': 'MI',
  'Minnesota': 'MN',
  'Mississippi': 'MS',
  'Missouri': 'MO',
  'Montana': 'MT',
  'Nebraska': 'NE',
  'Nevada': 'NV',
  'New Hampshire': 'NH',
  'New Jersey': 'NJ',
  'New Mexico': 'NM',
  'New York': 'NY',
  'North Carolina': 'NC',
  'North Dakota': 'ND',
  'Ohio': 'OH',
  'Oklahoma': 'OK',
  'Oregon': 'OR',
  'Pennsylvania': 'PA',
  'Rhode Island': 'RI',
  'South Carolina': 'SC',
  'South Dakota': 'SD',
  'Tennessee': 'TN',
  'Texas': 'TX',
  'Utah': 'UT',
  'Vermont': 'VT',
  'Virginia': 'VA',
  'Washington': 'WA',
  'West Virginia': 'WV',
  'Wisconsin': 'WI',
  'Wyoming': 'WY',
};

export const candidates: CandidateGroup[] = [
  {
    group: 'President',
    items: [
      {
        "name": 'Kamala Harris',
        "rating": '90% from LCV.',
        "description": 'Calls climate crisis an urgent issue and promoted the IRA - spending $20B to fight climate change',
        "link": 'https://www.whitehouse.gov/briefing-room/speeches-remarks/2023/07/14/remarks-by-vice-president-harris-on-combatting-climate-change-and-building-a-clean-energy-economy/',
        "party": Party.Democratic,
        "state": 'All',
      },
      {
        "name": 'Donald Trump',
        "rating": '30% from LCV.',
        "description": 'Pulled U.S. out of the Paris Agreement and rolled back efforts to fight climate change',
        "link": 'https://www.npr.org/2024/06/25/nx-s1-5006573/trump-election-2024-climate-change-fossil-fuels',
        "party": Party.Republican,
        "state": 'All',
      },
      {
        "name": 'Donald Trump',
        "rating": '30% from LCV.',
        "description": "Trump's delay of a $19.1 billion disaster relief bill for North Carolina hindered vital flood mitigation, worsening the effects of Hurricane Helene in 2023.",
        "link": 'https://news.yahoo.com/news/damning-news-report-revives-questions-104558837.html?fr=sycsrp_catchall',
        "party": Party.Republican,
        "state": 'NC',
      },
    ],
  },
  {
    group: 'Senate',
    items: [
      {
          "state": "AZ",
          "name": "Kyrsten Sinema",
          "description": "Supports moderate climate action, focusing on bipartisan solutions and market-driven clean energy investments, but is cautious about aggressive policies like the Green New Deal.",
          "link": "https://www.ft.com/content/a793ffb3-058e-44fd-8f99-f50eb10c3fff\n",
          "rating": "",
          "party": Party.Independent
      },
      {
          "state": "AZ",
          "name": "Mark Kelly",
          "description": "Advocates for aggressive action on climate change, including clean energy, reducing carbon emissions, and investing in renewable energy sources.",
          "link": "https://edition.cnn.com/2023/07/16/politics/mark-kelly-climate-change-heat-wave-cnntv/index.html",
          "rating": "",
          "party": Party.Democratic
      },
      {
          "state": "MT",
          "name": "Jon Tester",
          "description": "Supports renewable energy, emphasizes resource extraction",
          "link": "https://www.tester.senate.gov/about/issues/energy/\n",
          "rating": "",
          "party": Party.Democratic
      },
      {
          "state": "MT",
          "name": "Tim Sheehy",
          "description": "Favors market solutions and energy independence for addressing climate change.",
          "link": "https://guides.vote/guide/2024-montana-senate-voters-guide",
          "rating": "",
          "party": Party.Republican
      },
      {
          "state": "NV",
          "name": "Jacky Rosen",
          "description": "Strongly supported climate change action, including pushing for investment in green energy and infrastructure.",
          "link": "https://www.rosen.senate.gov/2022/01/21/rosen-helps-introduce-landmark-bipartisan-climate-resilience-legislation/",
          "rating": "",
          "party": Party.Democratic
      },
      {
          "state": "NV",
          "name": "Catherine Cortez Masto",
          "description": "Strong advocate for renewable energy and climate action ",
          "link": "https://www.cortezmasto.senate.gov/news/press-releases/cortez-masto-introduces-legislation-to-create-a-national-climate-service-corps/",
          "rating": "",
          "party": Party.Democratic
      },
      {
          "state": "OH",
          "name": "Sherrod Brown",
          "description": "Advocated for more action on climate change, emphasizing the need for a transition to renewable energy and protection of American workers in that shift.",
          "link": "https://www.brown.senate.gov/newsroom/press/release/brown-climate-change-threat-economy",
          "rating": "",
          "party": Party.Democratic
      },
      {
          "state": "PA",
          "name": "Bob Casey",
          "description": "Supports comprehensive climate policies, advocating for clean energy solutions and increased funding for climate change research.",
          "link": "https://www.casey.senate.gov/issues/climate-and-environment",
          "rating": "",
          "party": Party.Democratic
      },
      {
          "state": "WV",
          "name": "Joe Manchin",
          "description": "Advocates for energy independence, recognizes climate issues",
          "link": "https://www.vox.com/climate/23955967/joe-manchin-climate-change-senate-biden-inflation",
          "rating": "",
          "party": Party.Democratic
      },
      {
          "state": "WI",
          "name": "Tammy Baldwin ",
          "description": "Strong advocate for climate action and renewable energy",
          "link": "https://www.baldwin.senate.gov/news/press-releases/us-senator-tammy-baldwin-helps-introduce-legislation-to-achieve-net-zero-greenhouse-gas-emissions",
          "rating": "",
          "party": Party.Democratic
      },
      {
          "state": "FL",
          "name": "Debbie Mucarsel-Powell",
          "description": "Strong proponent of addressing climate change; emphasizes its impact on communities.",
          "link": "https://edition.cnn.com/2019/02/04/politics/debbie-mucarsel-powell-barrier-breakers/index.html",
          "rating": "",
          "party": Party.Democratic
      },
      {
          "state": "FL",
          "name": "Rick Scott",
          "description": "Generally skeptical of climate change; prioritizes economic interests.",
          "link": "https://www.politifact.com/article/2015/mar/11/fact-checking-rick-scott-environment-and-sea-level/",
          "rating": "",
          "party": Party.Republican
      },
      {
          "state": "MI",
          "name": "Elissa Slotkin",
          "description": "Supports strong climate action, clean energy, emissions cuts, and green jobs.",
          "link": "https://www.ontheissues.org/Domestic/Elissa_Slotkin_Environment.htm",
          "rating": "",
          "party": Party.Democratic
      },
      {
          "state": "MI",
          "name": "Mike Rogers ",
          "description": "Skeptical of human-driven climate change, opposes strict regulations, and supports market-driven solutions and energy innovation, like nuclear power.",
          "link": "https://climatepower.us/news/ahead-of-tonights-slotkin-rogers-debate-separating-truth-from-fiction-on-climate-and-clean-energy/",
          "rating": "",
          "party": Party.Republican
      },
      {
          "state": "ME",
          "name": "Angus King",
          "description": "Supports strong climate action, renewable energy, and carbon reduction as essential for both the environment and the economy.",
          "link": "https://www.mainepublic.org/climate/2024-01-12/angus-king-calls-for-climate-action-after-wednesday-storm",
          "rating": "",
          "party": Party.Independent
      },
      {
          "state": "ME",
          "name": "David Costello",
          "description": "Favors market-driven solutions and innovation to address climate change, opposed to strict government regulations.",
          "link": "https://www.ontheissues.org/Domestic/David_Costello_Environment.htm",
          "rating": "",
          "party": Party.Democratic
      },
      {
          "state": "ME",
          "name": "Demi Kouzounas",
          "description": "Supports climate action through innovation and balancing economic growth with environmental protection.",
          "link": "https://www.newscentermaine.com/article/news/politics/maine-politics/demi-kouzounas-lays-out-plan-to-unseat-senator-angus-king/97-26729ee1-1855-4461-8068-6b1db3e3fef7",
          "rating": "",
          "party": Party.Republican
      },
      {
          "state": "ND",
          "name": "Kevin Cramer",
          "description": "Skeptical of human-driven climate change and opposes strict climate regulations, favoring energy innovation and fossil fuels.",
          "link": "https://www.cramer.senate.gov/news/press-releases/sen-cramer-discusses-tackling-climate-change-on-npr",
          "rating": "",
          "party": Party.Republican
      },
      {
          "state": "ND",
          "name": "Katrina Christiansen",
          "description": "Supports clean energy, carbon reduction, and climate action for future generations.",
          "link": "https://www.katrinaforussenate.com/the-issues",
          "rating": "",
          "party": Party.Democratic
      },
      {
          "state": "NH",
          "name": "Maggie Hassan",
          "description": "Strong advocate for climate action, focusing on clean energy, emissions reductions, and funding for climate resilience",
          "link": "https://www.hassan.senate.gov/news/press-releases/as-climate-change-continues-to-increase-costs-of-disasters-senator-hassan-highlights-importance-of-investing-in-flood-mitigation-during-senate-hearing",
          "rating": "",
          "party": Party.Democratic
      },
      {
          "state": "VA",
          "name": "Tim Kaine",
          "description": "Supports a Green New Deal and prioritizes investment in renewable energy to address the climate crisis",
          "link": "https://www.kaine.senate.gov/issues/environment-and-energy",
          "rating": "",
          "party": Party.Democratic
      },
      {
          "state": "VA",
          "name": "Hung Cao",
          "description": "Supports addressing climate change through innovation and market-driven solutions, favoring energy independence and clean energy tech.",
          "link": "https://wydaily.com/latest-news/2024/10/09/kaine-faces-off-against-gop-challenger-cao-in-high-stakes-u-s-senate-race/",
          "rating": "",
          "party": Party.Republican
      },
      {
          "state": "CO",
          "name": "Michael Bennet",
          "description": "Vocal advocate for climate action, supporting aggressive policies aimed at reducing emissions and promoting renewable energy.",
          "link": "https://www.bennet.senate.gov/public/index.cfm/climate-change-environment",
          "rating": "",
          "party": Party.Democratic
      },
      {
          "state": "AL",
          "name": "Katie Britt",
          "description": "Skeptical of climate regulations like the Green New Deal and supports energy independence, focusing on fossil fuels and innovation.",
          "link": "https://yellowhammernews.com/5-questions-with-katie-britt-immigration-court-packing-rural-alabama-and-more/",
          "rating": "",
          "party": Party.Republican
      },
      {
          "state": "AR",
          "name": "John Boozman",
          "description": "Often voiced skepticism regarding the urgency of climate change action, emphasizing energy production from coal and natural gas while supporting adaptation measures.",
          "link": "https://www.boozman.senate.gov/public/index.cfm/2021/8/the-right-way-and-wrong-way-to-address-climate-change",
          "rating": "",
          "party": Party.Republican
      },
      {
          "state": "DE",
          "name": "Lisa Blunt Rochester",
          "description": "Supports clean energy, emissions cuts, and green jobs to address climate change.",
          "link": "https://whyy.org/articles/lisa-blunt-rochester-delaware-election-senate-2024-carper/",
          "rating": "",
          "party": Party.Democratic
      },
      {
          "state": "DE",
          "name": "Eric Hansen",
          "description": "Supports climate action through innovation, clean energy, and market-driven solutions.",
          "link": "https://www.wgmd.com/eric-hansen-formally-files-his-candidacy-for-u-s-senate/",
          "rating": "",
          "party": Party.Republican
      },
      {
          "state": "GA",
          "name": "Jon Ossoff",
          "description": "Supported climate policies aimed at reducing carbon emissions, transitioning to clean energy, and investing in green technologies.",
          "link": "https://www.politico.com/news/2021/06/01/jon-ossoff-climate-change-491505",
          "rating": "",
          "party": Party.Democratic
      },
      {
          "state": "ID",
          "name": "Mike Crapo",
          "description": "Generally skeptical about climate change regulations and favors market-based solutions rather than government mandates.",
          "link": "https://www.crapo.senate.gov/media/newsreleases/crapo-risch-warn-fed-to-stop-engaging-in-climate-activism",
          "rating": "",
          "party": Party.Republican
      },
      {
          "state": "IL",
          "name": "Dick Durbin",
          "description": "Advocate for aggressive climate action, emphasizing renewable energy, carbon reduction, and infrastructure improvements to combat climate change.",
          "link": "https://www.durbin.senate.gov/newsroom/press-releases/durbin-climate-action-cannot-wait",
          "rating": "",
          "party": Party.Democratic
      },
      {
          "state": "IN",
          "name": "Valerie McCray",
          "description": "Supports clean energy, carbon reduction, and policies for environmental justice to tackle climate change.",
          "link": "https://valeriemccray.org/platform/",
          "rating": "",
          "party": Party.Democratic
      },
      {
          "state": "IN",
          "name": "Jim Banks",
          "description": "Opposes strict climate regulations, favoring energy independence and solutions that prioritize fossil fuels.",
          "link": "https://www.wboi.org/news/2023-01-17/rep-banks-announces-run-for-us-senate",
          "rating": "",
          "party": Party.Republican
      },
      {
          "state": "IA",
          "name": "Chuck Grassley",
          "description": "Support pragmatic approaches to climate change, focusing on agricultural innovation and energy diversification without heavily regulating fossil fuels.",
          "link": "https://www.desmoinesregister.com/story/opinion/columnists/2019/10/30/sen-chuck-grassley-can-climate-hero/2490883001/",
          "rating": "",
          "party": Party.Republican
      },
      {
          "state": "KS",
          "name": "Jerry Moran",
          "description": "Supported climate action on certain aspects, particularly concerning agricultural practices and energy efficiency, but often opposes stringent regulations on fossil fuel industries",
          "link": "https://www.moran.senate.gov/public/index.cfm/2021/6/sen-moran-statement-on-the-growing-climate-solutions-act",
          "rating": "",
          "party": Party.Republican
      },
      {
          "state": "KY",
          "name": "Mitch McConnell",
          "description": "Consistent skeptic of large-scale climate legislation, often emphasizing economic impacts and energy independence through fossil fuels.",
          "link": "https://thehill.com/homenews/senate/435904-mcconnell-i-do-believe-in-human-caused-climate-change/",
          "rating": "",
          "party": Party.Republican
      },
      {
          "state": "LA",
          "name": "John Kennedy ",
          "description": "Downplayed the urgency of climate change and often opposes environmental regulations that could harm the energy industry.",
          "link": "https://www.foxnews.com/politics/kennedy-stumps-biden-official-fifty-trillion-price-tag-climate-change",
          "rating": "",
          "party": Party.Republican
      },
      {
          "state": "MD",
          "name": "Angela Alsobrooks",
          "description": "Supports climate action through clean energy, carbon reduction, and green job creation.",
          "link": "https://jmoreliving.com/2024/09/17/senate-candidates-angela-alsobrooks-and-larry-hogan-share-their-views-with-jmore/",
          "rating": "",
          "party": Party.Democratic
      },
      {
          "state": "MD",
          "name": "Larry Hogan",
          "description": "Supports clean energy, emissions reduction, and market-based climate solutions.",
          "link": "https://mddems.org/news/fact-check-republican-larry-hogans-real-record-of-opposing-abortion-access/",
          "rating": "",
          "party": Party.Republican
      },
      {
          "state": "MS",
          "name": "Roger Wicker",
          "description": "Opposes strict climate regulations, supporting energy independence and clean energy innovation.",
          "link": "https://www.britannica.com/biography/Roger-Wicker",
          "rating": "",
          "party": Party.Republican
      },
      {
          "state": "MS",
          "name": "Ty Pinkins",
          "description": "Supports the Paris Climate Agreement and carbon capture, and advocates banning non-biodegradable plastics",
          "link": "https://www.isidewith.com/candidates/ty-pinkins/policies/environmental/climate-change-3",
          "rating": "",
          "party": Party.Democratic
      },
      {
          "state": "NE",
          "name": "Deb Fischer",
          "description": "Supports market solutions, energy independence, and clean energy innovation for climate change.",
          "link": "https://www.fischer.senate.gov/public/index.cfm/2022/8/fischer-colleagues-to-fhwa-latest-climate-proposal-is-burdensome-potentially-unlawful-and-counter-to-congressional-intent",
          "rating": "",
          "party": Party.Republican
      },
      {
          "state": "NE",
          "name": "Dan Osborn",
          "description": "Supports clean energy and innovation for climate change, prioritizing growth and energy independence.",
          "link": "https://onyourballot.vote411.org/candidate-detail.do?id=68439080",
          "rating": "",
          "party": Party.Independent
      },
      {
          "state": "NJ",
          "name": "Andy Kim",
          "description": "Supports clean energy, emissions reductions, and strong climate action.",
          "link": "https://www.andykim.com/issues/environment/",
          "rating": "",
          "party": Party.Democratic
      },
      {
          "state": "NJ",
          "name": "Curtis Bashaw",
          "description": "Supports clean energy and practical solutions to combat climate change.",
          "link": "https://njbmagazine.com/monthly-articles/the-senatorial-battle-bashaw-vs-kim/",
          "rating": "",
          "party": Party.Republican
      },
      {
          "state": "NM",
          "name": "Martin Heinrich",
          "description": "Advocates for clean energy, carbon reduction, and strong climate action.",
          "link": "https://www.martinheinrich.com/about",
          "rating": "",
          "party": Party.Democratic
      },
      {
          "state": "NM",
          "name": "Nella Domenici",
          "description": "Supports clean energy and carbon reduction to combat climate change.",
          "link": "https://www.nellaforsenate.com/issues",
          "rating": "",
          "party": Party.Republican
      },
      {
          "state": "NY",
          "name": "Kirsten Gillibrand",
          "description": "Supports bold climate action, clean energy, and green job creation.",
          "link": "https://nylcv.org/candidate/kirsten-gillibrand/",
          "rating": "",
          "party": Party.Democratic
      },
      {
          "state": "NY",
          "name": "Mike Sapraicone",
          "description": "Supports clean energy and emissions reduction.",
          "link": "https://www.amny.com/news/mike-sapricone-new-york-gop-senate-candidate/",
          "rating": "",
          "party": Party.Republican
      },
      {
          "state": "NC",
          "name": "Ted Budd",
          "description": "Acknowledges climate change but favors market solutions and energy independence over strict regulations.",
          "link": "https://www.budd.senate.gov/priority-issues/achieving-energy-dominance/",
          "rating": "",
          "party": Party.Republican
      },
      {
          "state": "NC",
          "name": "Cheri Beasley",
          "description": "Supports clean energy, emissions cuts, and climate justice.",
          "link": "https://www.sierraclub.org/north-carolina/sierra-club-endorses-cheri-beasley-for-us-senate",
          "rating": "",
          "party": Party.Democratic
      },
      {
          "state": "OK",
          "name": "James Lankford",
          "description": "Expressed skepticism about climate change regulations and favors innovation and energy independence without heavy government intervention.",
          "link": "https://www.lankford.senate.gov/news/press-releases/lankford-fights-back-against-radical-environmental-agenda/",
          "rating": "",
          "party": Party.Republican
      },
      {
          "state": "SC",
          "name": "Lindsey Graham",
          "description": "Called for climate change action but opposes policies like the Green New Deal, preferring market-driven solutions.",
          "link": "https://www.cnbc.com/2023/02/18/climate-reparations-are-not-going-to-be-helpful-us-sen-lindsey-graham-says.html",
          "rating": "",
          "party": Party.Republican
      },
      {
          "state": "SD",
          "name": "John Thune",
          "description": "Supports a pragmatic approach to climate change, focusing on technological innovation and energy efficiency, without heavy regulatory burdens on the fossil fuel industry.",
          "link": "https://www.thune.senate.gov/public/index.cfm/2021/10/thune-democrats-prioritize-radical-climate-agenda-over-addressing-ongoing-energy-crisis",
          "rating": "",
          "party": Party.Republican
      },
      {
          "state": "TN",
          "name": "Marsha Blackburn",
          "description": "Vocal critic of climate change regulations and the Green New Deal, prioritizing energy production and economic growth",
          "link": "https://www.factcheck.org/2014/02/blackburn-takes-on-the-science-guy/",
          "rating": "",
          "party": Party.Republican
      },
      {
          "state": "TN",
          "name": "Gloria Johnson",
          "description": "Supports clean energy, carbon reduction, and strong federal climate policies for environmental justice.",
          "link": "https://cleanenergy.org/blog/candidate-gloria-johnson-on-climate-energy/",
          "rating": "",
          "party": Party.Democratic
      },
      {
          "state": "TX",
          "name": "Ted Cruz",
          "description": "Staunch skeptic of the climate change agenda, often opposing regulations and advocating for oil and gas industry interests",
          "link": "https://www.npr.org/2015/12/09/459026242/scientific-evidence-doesn-t-support-global-warming-sen-ted-cruz-says",
          "rating": "",
          "party": Party.Republican
      },
      {
          "state": "TX",
          "name": "Colin Allred",
          "description": "Supports clean energy, emissions reductions, and green job investments to combat climate change.",
          "link": "https://allred.house.gov/issues/energy-and-environment",
          "rating": "",
          "party": Party.Democratic
      },
      {
          "state": "UT",
          "name": "John Curtis",
          "description": "Supports market solutions and clean energy to address climate change.",
          "link": "https://www.politico.com/news/2021/10/31/john-curtis-climate-summit-glasgow-518013",
          "rating": "",
          "party": Party.Republican
      },
      {
          "state": "UT",
          "name": "Caroline Gleich",
          "description": "Advocates for urgent climate action, clean energy, and protecting public lands.",
          "link": "https://carolinegleich.com/athlete-activist/",
          "rating": "",
          "party": Party.Democratic
      },
      {
          "state": "VT",
          "name": "Bernie Sanders",
          "description": "Strong advocate for aggressive climate change policies, including the Green New Deal, renewable energy, and climate justice.",
          "link": "https://www.vox.com/2020/2/19/21142923/bernie-sanders-climate-change-policy-plan-2020",
          "rating": "",
          "party": Party.Democratic
      },
      {
          "state": "VT",
          "name": "Gerald Malloy",
          "description": "Supports clean energy, carbon reduction, and climate policies for environmental justice.",
          "link": "https://www.wamc.org/news/2024-01-16/republican-gerald-malloy-talks-about-entering-the-2024-vermont-u-s-senate-race",
          "rating": "",
          "party": Party.Republican
      },
      {
          "state": "WA",
          "name": "Maria Cantwell",
          "description": "Supports clean energy, emissions cuts, and climate policies for green jobs and community protection.",
          "link": "https://www.cantwell.senate.gov/issues/environment",
          "rating": "",
          "party": Party.Democratic
      },
      {
          "state": "WA",
          "name": "Raul Garcia",
          "description": "Supports strong climate action, clean energy, emissions reduction, and environmental justice.",
          "link": "https://www.heraldnet.com/news/garcia-challenges-seasons-incumbent-cantwell-for-us-senate/",
          "rating": "",
          "party": Party.Republican
      },
      {
          "state": "WY",
          "name": "Scott Morrow",
          "description": "Considers climate change a major threat and advocates for strong actions to mitigate its impact​",
          "link": "https://oilcity.news/community/2024/08/02/candidate-q-and-a-scott-morrow-democrat-for-u-s-senate/",
          "rating": "",
          "party": Party.Democratic
      },
      {
          "state": "WY",
          "name": "John Barrasso",
          "description": "Vocal critic of climate regulations and policies like the Green New Deal, emphasizing fossil fuel energy independence.",
          "link": "https://www.barrasso.senate.gov/public/index.cfm/2021/2/barrasso-undermining-america-s-energy-security-will-not-solve-climate-change",
          "rating": "",
          "party": Party.Republican
      },
      {
          "state": "CA",
          "name": "Adam Schiff",
          "description": "Supports strong climate action, clean energy, carbon reduction, and environmental justice.",
          "link": "https://schiff.house.gov/issues/climate-and-environment",
          "rating": "",
          "party": Party.Democratic
      },
      {
          "state": "CA",
          "name": "Steve Garvey",
          "description": "Recognizes the importance of addressing climate change and supports efforts to raise awareness about its risks.",
          "link": "https://www.kpbs.org/news/politics/2024/10/07/california-us-senate-race-explainer",
          "rating": "",
          "party": Party.Republican
      },
      {
          "state": "CT",
          "name": "Chris Murphy",
          "description": "Sees climate change as a security threat and supports emission cuts through bipartisan efforts",
          "link": "https://www.murphy.senate.gov/newsroom/press-releases/murphy-the-biden-administration-views-climate-change-as-existential",
          "rating": "",
          "party": Party.Democratic
      },
      {
          "state": "CT",
          "name": "Matt Corey",
          "description": "Focuses on economic and security issues, not climate change",
          "link": "https://www.ctpublic.org/news/2024-08-13/ct-gop-primary-us-senate-matthew-corey",
          "rating": "",
          "party": Party.Republican
      },
      {
          "state": "HI",
          "name": "Mazie Hirono",
          "description": "Advocates for strong climate action, supporting clean energy policies like the Clean Power Plan and opposing efforts to weaken climate regulations",
          "link": "https://www.lcv.org/media-center/lcv-action-fund-endorses-senator-mazie-hirono-re-election/",
          "rating": "",
          "party": Party.Democratic
      },
      {
          "state": "HI",
          "name": "Bob McDermott",
          "description": "Skeptical of human-caused climate change and opposes large investments in renewable energy",
          "link": "https://www.staradvertiser.com/2024/07/22/election/2024-election-bob-mcdermott/",
          "rating": "",
          "party": Party.Republican
      },
      {
          "state": "MA",
          "name": "Elizabeth Warren",
          "description": "Advocates for aggressive action on climate change, supporting the Green New Deal as a way to address environmental challenges while promoting economic growth and innovation",
          "link": "https://www.warren.senate.gov/oversight/letters/warren-senators-urge-treasury-department-to-address-climate-related-financial-risks",
          "rating": "",
          "party": Party.Democratic
      },
      {
          "state": "MA",
          "name": "John Deaton",
          "description": "Critical of climate change policies, claiming they are often just \"class warfare\" without effective solutions, and emphasizes the need for pro-growth legislation instead",
          "link": "https://www.wamc.org/news/2024-09-12/her-policies-do-not-help-poor-people-republican-deaton-makes-longshot-case-for-replacing-warren-in-the-senate",
          "rating": "",
          "party": Party.Republican
      },
      {
          "state": "MN",
          "name": "Amy Klobuchar",
          "description": "Advocates for 100% net-zero emissions by 2050, significant clean energy investments, and prioritizing the needs of communities most affected by climate change​",
          "link": "https://www.klobuchar.senate.gov/public/index.cfm/homegrown-energy-environment-natural-resources",
          "rating": "",
          "party": Party.Democratic
      },
      {
          "state": "MN",
          "name": "Royce White",
          "description": "Views climate change as a natural occurrence and emphasizes economic growth over environmental regulations​",
          "link": "https://www.mprnews.org/story/2024/05/30/joe-fraser-royce-white-primary-battle-gop-challenger-to-dfl-sen-klobuchar",
          "rating": "",
          "party": Party.Republican
      },
      {
          "state": "MO",
          "name": "Lucas Kunce",
          "description": "Supports aggressive climate action, advocating for a shift from fossil fuels to renewable energy",
          "link": "https://www.lcv.org/media-center/lcv-action-fund-endorses-lucas-kunce-for-senate/",
          "rating": "",
          "party": Party.Democratic
      },
      {
          "state": "MO",
          "name": "Josh Hawley",
          "description": "Opposes international climate agreements, advocating for increased domestic energy production to enhance U.S. energy independence",
          "link": "https://www.hawley.senate.gov/hawley-leads-bill-restoring-american-energy-independence-ending-reliance-foreign-nations/",
          "rating": "",
          "party": Party.Republican
      },
      {
          "state": "RI",
          "name": "Sheldon Whitehouse",
          "description": "Emphasizes urgent climate action, advocating for legislation that ends fossil fuel subsidies and promotes renewable energy​",
          "link": "https://www.whitehouse.senate.gov/news/release/whitehouse-outlines-next-steps-to-lower-emissions-after-passage-of-landmark-climate-bill/",
          "rating": "",
          "party": Party.Democratic
      },
      {
          "state": "RI",
          "name": "Patricia Morgan",
          "description": "Opposes offshore wind projects due to concerns over marine life and high energy costs, calling for comprehensive scientific studies first",
          "link": "https://www.thenewportbuzz.com/u-s-senate-race-heats-up-patricia-morgan-calls-for-halt-on-offshore-wind-projects/51417#google_vignette",
          "rating": "",
          "party": Party.Republican
      }
  ]
  },
  {
    group: 'House of Representatives',
    items: [
      {
        "name": 'Gay Valimont',
        "rating": '90% from LCV.',
        "description": 'Strong advocate for climate action; emphasizes urgency in addressing climate change.',
        "link": 'https://www.npr.org/2024/06/25/nx-s1-5006573/trump-election-2024-climate-change-fossil-fuels',
        "party": Party.Democratic,
        "state": 'FL',
      },
      {
        "name": 'Matt Gaetz',
        "rating": '25% from LCV.',
        "description": 'Skeptical of climate change; focuses on economic growth.',
        "party": Party.Republican,
        "link": 'https://www.newsweek.com/matt-gaetz-voted-against-fema-funding-before-hurricane-helene-hit-1961501',
        "state": 'FL',
      },
      {
        "name": 'Abigail Spanberger',
        "rating": '90% from LCV.',
        "description": 'Supports climate action with a focus on clean energy and policies that protect rural communities.',
        "link": 'https://spanberger.house.gov/resources/energy-and-environment',
        "party": Party.Democratic,
        "state": 'VA',
      },
      {
        "name": 'Tony Gonzales',
        "rating": '90% from LCV.',
        "description": 'Supports climate action with a focus on clean energy and policies that protect rural communities.',
        "link": 'https://c3act.org/people/tony-gonzales/',
        "party": Party.Republican,
        "state": 'TX',
      },
    ],
  },
  {
    group: 'Governor',
    items: [
    {
        "state": "DE",
        "name": "Matt Meyer",
        "description": "Prioritizes addressing climate change through sustainable practices and renewable energy investments",
        "link": "https://www.delawarepublic.org/show/the-green/2024-08-13/candidate-conversations-democratic-candidate-for-governor-matt-meyer",
        "party": Party.Democratic,
        "rating": ""
    },
    {
        "state": "DE",
        "name": "Mike Ramone",
        "description": "Supports climate solutions through entrepreneurship rather than government mandates.",
        "link": "https://www.delawarepublic.org/show/the-green/2024-08-16/delaware-election-candidates-stake-out-positions-on-environmental-issues",
        "party": Party.Republican,
        "rating": ""
    },
    {
        "state": "IN",
        "name": "Jennifer McCormick",
        "description": "Calls for Indiana to adopt renewable energy and sustainable practices to combat climate change",
        "link": "https://www.wvpe.org/indiana-news/2024-04-03/jennifer-mccormick-says-indiana-ready-for-something-different-after-20-years-of-gop-control",
        "party": Party.Democratic,
        "rating": ""
    },
    {
        "state": "IN",
        "name": "Mike Braun",
        "description": "Advocates for market-based solutions to climate change, supporting the Growing Climate Solutions Act to empower farmers in carbon markets.",
        "link": "https://www.braun.senate.gov/news/press-releases/what-theyre-saying-about-growing-climate-solutions-act/",
        "party": Party.Republican,
        "rating": ""
    },
    {
        "state": "MO",
        "name": "Crystal Quade",
        "description": "Supports urgent climate action and investing in renewable energy for Missouri's sustainable future.",
        "link": "https://abc17news.com/voter-guide-2024/2024/06/26/crystal-quade-candidate-for-missouri-governor/",
        "party": Party.Democratic,
        "rating": ""
    },
    {
        "state": "MO",
        "name": "Mike Kehoe",
        "description": "Advocates for a balanced approach to climate change, supporting economic growth alongside environmental responsibility",
        "link": "https://themissouritimes.com/opinion-mike-kehoe-is-the-clear-choice-for-missouri-governor/",
        "party": Party.Republican,
        "rating": ""
    },
    {
        "state": "MT",
        "name": "Greg Gianforte",
        "description": "Aligned with the GOP's stance on climate skepticism and has focused on economic growth, particularly in sectors like fossil fuels. He has resisted stronger climate policies and clean energy transitions.\n",
        "link": "https://montanafreepress.org/2023/05/12/gianforte-signs-climate-change-analysis-ban-into-law/\n",
        "party": Party.Republican,
        "rating": ""
    },
    {
        "state": "MT",
        "name": "Ryan Busse",
        "description": "Supports strong climate action to ensure Montana's environmental protection and accountability.",
        "link": "https://www.mtpr.org/montana-news/2023-09-15/democrat-ryan-busse-joins-the-race-for-montana-governor",
        "party": Party.Democratic,
        "rating": ""
    },
    {
        "state": "NC",
        "name": "Josh Stein",
        "description": "Supports aggressive climate action and aims for North Carolina to achieve carbon neutrality by 2050​",
        "link": "https://cleanenergy.org/blog/candidate-josh-stein-on-climate-energy/",
        "party": Party.Democratic,
        "rating": ""
    },
    {
        "state": "NC",
        "name": "Mark Robinson",
        "description": "Dismisses climate change as \"junk science,\" questioning the validity of climate science in his gubernatorial campaign​",
        "link": "https://www.wfae.org/energy-environment/2023-08-11/as-he-runs-for-governor-lt-gov-mark-robinson-casts-doubt-on-climate-science",
        "party": Party.Republican,
        "rating": ""
    },
    {
        "state": "ND",
        "name": "Merrill Piepkorn",
        "description": "Advocates for sustainable energy and the protection of North Dakota's natural resources to combat climate change.",
        "link": "https://kfgo.com/2024/10/03/piepkorn-strikes-positive-notes-outlines-policy-stance/",
        "party": Party.Democratic,
        "rating": ""
    },
    {
        "state": "ND",
        "name": "Kelly Armstrong",
        "description": "Advocates for an \"all of the above\" energy strategy, promoting balanced discussions on energy sources without framing climate change as divisive",
        "link": "https://www.minotdailynews.com/news/local-news/2022/10/congressman-energy-industry-needs-to-fight-right/",
        "party": Party.Republican,
        "rating": ""
    },
    {
        "state": "UT",
        "name": "Spencer Cox",
        "description": "Supports natural resource management and some clean energy initiatives but has not pursued aggressive climate action, favoring industries like oil, gas, and mining.",
        "link": "https://www.politico.com/news/2021/09/01/spencer-cox-utah-covid-promises-508111\n",
        "party": Party.Republican,
        "rating": ""
    },
    {
        "state": "UT",
        "name": "Brian King",
        "description": "Advocates for comprehensive climate action to protect Utah's environment and residents.",
        "link": "https://www.kuer.org/politics-government/2023-12-04/utah-democratic-rep-brian-king-announces-a-challenge-to-gov-cox",
        "party": Party.Democratic,
        "rating": ""
    },
    {
        "state": "VT",
        "name": "Phil Scott ",
        "description": "Backed clean energy initiatives, expanded renewables, and advanced Vermont’s climate goals, making significant strides in climate resilience and carbon reduction.",
        "link": "https://governor.vermont.gov/press-release/governor-phil-scott-joins-us-climate-alliance-governors-applauding-unites-states\n",
        "party": Party.Republican,
        "rating": ""
    },
    {
        "state": "VT",
        "name": "Esther Charlestin",
        "description": "Calls for urgent action on climate change, advocating for a collaborative and proactive approach to create a sustainable future for Vermont.",
        "link": "https://vtdigger.org/2024/01/05/middlebury-educator-and-consultant-esther-charlestin-announces-run-for-governor/",
        "party": Party.Democratic,
        "rating": ""
    },
    {
        "state": "WA",
        "name": "Bob Ferguson",
        "description": "Advocates for robust environmental protections and aims to enhance Washington's climate action initiatives",
        "link": "https://www.sierraclub.org/washington/2024-endorsements",
        "party": Party.Democratic,
        "rating": ""
    },
    {
        "state": "WA",
        "name": "Dave Reichert",
        "description": "Acknowledges climate change but criticizes current policies for increasing costs without effectively reducing emissions.",
        "link": "https://www.heraldnet.com/news/ferguson-reichert-clash-on-crime-abortion-and-trump-in-first-debate/",
        "party": Party.Republican,
        "rating": ""
    },
    {
        "state": "WV",
        "name": "Steve Williams",
        "description": "Advocates for collaborative action on climate change, focusing on community health and sustainable policies",
        "link": "https://mountainstatespotlight.org/2024/05/15/williams-huntington-governor-turnaround/",
        "party": Party.Democratic,
        "rating": ""
    },
    {
        "state": "WV",
        "name": "Patrick Morrisey",
        "description": "Advocates for balancing energy needs and climate policies, opposing regulations that could hurt West Virginia's economy",
        "link": "https://wvpublic.org/morrisey-previews-supreme-court-case-against-epa-power-on-carbon/",
        "party": Party.Republican,
        "rating": ""
    },
    {
        "state": "WY",
        "name": "Mark Gordon",
        "description": "Supports fossil fuel industries, particularly coal, oil, and gas, and has avoided aggressive climate policies, despite some renewable energy initiatives in Wyoming.",
        "link": "https://www.forbes.com/sites/bobeccles/2023/11/22/climate-change-in-wyoming-the-sanity-of-governor-mark-gordon-and-the-inanity-of-the-wyoming-freedom-caucus/",
        "party": Party.Republican,
        "rating": ""
    }
  ]
  },
];

export const countyData: { [key: string]: { video: string, warning: string, questions: string[] } } = {
  'Erie County, Pennsylvania': {
    video: 'eYOpfGLJ30s',
    warning: 'Erie County is facing rising lake levels and severe storms threatening its shoreline, economy, and environment',
    questions: [
      "Rising lake levels and severe storms?",
    ],
  },
};

export const stateData: { [key: string]: { video: string, warning: string, questions: string[] } } = {
  'az': {
    video: 'wxr-W5f0EzQ',
    warning: 'Phoenix breaks temperature record with 19th day of extreme heat. Insurance prices are also increasing each year.',
    questions: [
      'Temperatures are getting hotter?',
      'Insurance prices going up?',
      'Droughts getting worse?'
    ],
  },
  'nv': {
    video: '9wGb557yAgc',
    warning: 'Temperatures are increasing regularly in Nevada. Insurance prices are on the rise.',
    questions: [
      'Temperatures are getting hotter?',
      'Insurance prices going up?',
      'Droughts getting worse?'
    ],
  },
  'ga': {
    video: 'h5dc6yAA84c',
    warning: 'Hurricanes are getting stronger and more frequent in Georgia, leading to significant damage and rising insurance prices.',
    questions: [
      'Hurricanes getting stronger, more frequent, and causing more damage?',
      'Flooding destroying homes and communities?',
      'Insurance prices going up?',
    ],
  },
  'mi': {
    video: 'bj2YtSMKEBU',
    warning: 'Michigan home   insurance rates are rising every year, affecting residents statewide.',
    questions: [
      'Insurance prices increasing each year?',
      'Flooding destroying homes and communities?',
      'Temperatures are getting hotter?',
    ],
  },
  'wi': {
    video: 'qTfZwcesdAw',
    warning: 'Deadly flooding has devastated homes and communities in Wisconsin.',
    questions: [
      'Flooding destroying homes and communities?',
      'Insurance prices increasing each year?',
      'Temperatures are getting hotter?',
    ],
  },
  'pa': {
    video: 'xpIjd_cHL2o',
    warning: 'Flooding is devastating homes and communities in Pennsylvania, causing widespread destruction and displacing residents.',
    questions: [
      'Flooding destroying homes and communities?',
      'Insurance prices increasing each year?',
      'Temperatures are getting hotter?',
      'Problems with Agriculture?'
    ],
  },
  'nc': {
    video: 'uMlhkLbOnmA',
    warning: 'Hurricanes are causing more damage in North Carolina, resulting in rising insurance costs.',
    questions: [
      'Hurricanes getting stronger, more frequent, and causing more damage?',
      'Flooding destroying homes and communities?',
      'Insurance prices going up?',
    ],
  },
  'fl': {
    video: 'knfcsOoYsGI',
    warning: 'Storm surge from hurricanes in Florida is devastating communities, and insurance prices are on the rise.',
    questions: [
      'Hurricanes getting stronger, more frequent, and causing more damage due to rising sea levels?',
      'Insurance cancelled or prices rising?',
      'Sea level rising & beaches and houses at risk?',
      'Temperatures increasing regularly',
    ],
  },
  'ne': {
    video: 'Vox2kq3ammk',
    warning: 'Wildfires burning large areas, and destroying homes in Nebraska. Temperatures and insurance prices are increasing.',
    questions: [
      'Wildfires burning large areas, and destroying homes?',
      'Insurance cancelled and prices rising?',
      'Temperatures going up?',
    ],
  },
  'or': {
    video: '3-4SR8vC1kA',
    warning: 'Oregon faces increasing wildfires, rising temperatures, and growing insurance premiums.',
    questions: [
      'Wildfires burning large areas, and destroying homes?',
      'Insurance cancelled and prices rising?',
      'Temperatures going up?',
    ],
  },
  'nm': {
    video: 'TZV__hUOkJQ',
    warning: 'New Mexico is experiencing regular temperature increases, wildfires, and rising insurance rates.',
    questions: [
      'Wildfires burning large areas, and destroying homes?',
      'Temperatures going up?',
      'Insurance cancelled and prices rising?',
    ],
  },
  'co': {
    video: '7P4fVa2_8cg',
    warning: 'Colorado is seeing stronger winds, wildfires, and rising insurance rates as extreme weather increases.',
    questions: [
      'Wildfires burning large areas, and destroying homes?',
      'Insurance cancelled and prices rising?',
      'Strong winds increasing, with more tornadoes?',
    ],
  },
  'ca': {
    video: 'u_b0o-1_r9Q',
    warning: 'Wildfires and droughts in California are increasing, leading to rising temperatures and insurance premiums.',
    questions: [
      'Wildfires burning large areas, and destroying homes?',
      'Insurance cancelled and prices rising?',
      'Temperatures going up?',
      'Droughts increasing, with less water for longer periods?',
    ],
  },
};
