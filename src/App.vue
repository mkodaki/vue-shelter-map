<script setup lang="ts">
import { ref, onMounted, watch, onUpdated,  } from 'vue';
import { GoogleMap, Marker, InfoWindow } from 'vue3-google-map';
import { supabase } from './lib/supabaseClient';
import M from "materialize-css";

const center = { lat: 35.681436611723285, lng: 139.76704969467255 };
const key = import.meta.env.VITE_GOOGLE_API_KEY;

const mapRef: any = ref(null);
const shelters: any = ref([]);
const prefectureList: any = ref([]);

let selected_pref = ref('');
let location = ref('');
let checkFlood = ref(false);
let checkLandslide = ref(false);
let checkStormSurge = ref(false);
let checkEarthquake = ref(false);
let checkTsunami = ref(false);
let checkFire = ref(false);
let checkInlandWaters = ref(false);
let checkVolcano = ref(false);

const debounce = (func: any, wait = 1000) => {
  console.log(wait);
  let timer: any;
  return () => {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      func();
    }, wait)
  }
};

const getPrefectureList = async function () {
  const { data } = await supabase
    .from('prefecture_master')
    .select()
    .order('display_order');

  console.log(data);
  if (!data || data.length > 0) {
    prefectureList.value = data;
  }
}

const getShelters = async function () {
  const { data } = await supabase
    .from('evacuation_shelter')
    .select(`
      location_name,
      address,
      latitude,
      longitude,
      prefecture_master!inner(
        latitude,
        longitude
      )
    `)
    .eq('prefecture_code', selected_pref.value)
    .like('location_name', '%' + location.value + '%')
    .in('flood', checkFlood.value ? ['1'] : ['0', '1'])
    .in('landslide', checkLandslide.value ? ['1'] : ['0', '1'])
    .in('storm_surge', checkStormSurge.value ? ['1'] : ['0', '1'])
    .in('earthquake', checkEarthquake.value ? ['1'] : ['0', '1'])
    .in('tsunami', checkTsunami.value ? ['1'] : ['0', '1'])
    .in('fire', checkFire.value ? ['1'] : ['0', '1'])
    .in('inland_waters', checkInlandWaters.value ? ['1'] : ['0', '1'])
    .in('volcano', checkVolcano.value ? ['1'] : ['0', '1']);

  console.log(data);
  if (data && data.length > 0) {
    const lat = data[0].prefecture_master !== null ? data[0].prefecture_master.latitude : null;
    const lng = data[0].prefecture_master !== null ? data[0].prefecture_master.longitude : null;
    mapRef.value.map.panTo({ lat: lat, lng: lng });
    shelters.value = data;
  } else {
    M.Toast.dismissAll();
    M.toast({ html: '条件に該当する避難所はありません' });
  }
}

onMounted(() => {
  M.AutoInit();
  getPrefectureList();
});

onUpdated(() => {
  const elems: any = document.querySelector('select');
  const options = {};
  M.FormSelect.init(elems, options);
});

watch([
  selected_pref,
  checkFlood,
  checkLandslide,
  checkStormSurge,
  checkEarthquake,
  checkTsunami,
  checkFire,
  checkInlandWaters,
  checkVolcano], () => {
    if (selected_pref.value.length < 1) {
      M.Toast.dismissAll();
      M.toast({ html: '都道府県を選択してください' });
      return false;
    }
    getShelters();
  }
);

watch(location, () => {
  if (selected_pref.value.length < 1) {
    M.Toast.dismissAll();
    M.toast({ html: '都道府県を選択してください' });
    return false;
  }
  debounce(getShelters, 1000)();
});
</script>

<template>
  <div class="container">
    <ul id="slide-out" class="sidenav">
      <li>
        <div class="row toplevel">
          <form class="col s12">
            <div class="row">
              <div class="input-field col s8">
                <select id="selected_pref" v-model="selected_pref">
                  <option value="" disabled selected></option>
                  <option v-for="(prefecture, index) in prefectureList" :value="prefecture.prefecture_code" :key="index">
                    {{ prefecture.prefecture_name }}
                  </option>
                </select>
                <label for="selected_pref">都道府県</label>
              </div>
            </div>
            <div class="row">
              <div class="input-field col s12">
                <input type="text" id="location" class="validate" v-model="location">
                <label for="location">施設名</label>
              </div>
            </div>
            <div class="row">
              <div class="subheader col s12">災害種別</div>
              <div class="input-field col s12">
                <label>
                  <input type="checkbox" v-model="checkFlood" />
                  <span>洪水</span>
                </label>
              </div>
              <div class="input-field col s12">
                <label>
                  <input type="checkbox" v-model="checkLandslide" />
                  <span>崖崩れ、土石流及び地滑り</span>
                </label>
              </div>
              <div class="input-field col s12">
                <label>
                  <input type="checkbox" v-model="checkStormSurge" />
                  <span>高潮</span>
                </label>
              </div>
              <div class="input-field col s12">
                <label>
                  <input type="checkbox" v-model="checkEarthquake" />
                  <span>地震</span>
                </label>
              </div>
              <div class="input-field col s12">
                <label>
                  <input type="checkbox" v-model="checkTsunami" />
                  <span>津波</span>
                </label>
              </div>
              <div class="input-field col s12">
                <label>
                  <input type="checkbox" v-model="checkFire" />
                  <span>大規模な火事</span>
                </label>
              </div>
              <div class="input-field col s12">
                <label>
                  <input type="checkbox" v-model="checkInlandWaters" />
                  <span>内水氾濫</span>
                </label>
              </div>
              <div class="input-field col s12">
                <label>
                  <input type="checkbox" v-model="checkVolcano" />
                  <span>火山現象</span>
                </label>
              </div>
            </div>
          </form>
        </div>
      </li>
    </ul>
  </div>
  <div id="sidenav-opener">
    <a href="#" data-target="slide-out" class="sidenav-trigger"><i class="material-icons">search</i></a>
  </div>
  <div id="map">
    <GoogleMap ref="mapRef" :api-key="key" :zoom="13" :center="center" id="map">
      <!-- <MarkerCluster> -->
      <Marker v-for="shelter in shelters" :key="shelter.seq"
        :options="{ position: { lat: shelter.latitude, lng: shelter.longitude } }">
        <InfoWindow>
          <article>
            <h6>{{ shelter.location_name }}</h6>
            <p>住所: {{ shelter.address }}</p>
            <p>座標: {{ shelter.latitude }} {{ shelter.longitude }}</p>
          </article>
        </InfoWindow>
      </Marker>
      <!-- </MarkerCluster> -->
    </GoogleMap>
  </div>
</template>

<style scoped>
.row.toplevel {
  margin-top: 20px;
}

.container .col {
  line-height: 1.5rem;
}

.subheader {
  font-weight: bold;
}

#map {
  width: 90vw;
  height: 90vh;
  margin: 0 auto 0 10px;
}

#sidenav-opener {
  position: absolute;
  top: 30px;
  left: 10px;
}

.debug {
  border: 1px solid rgb(0, 0, 0);
}
</style>
