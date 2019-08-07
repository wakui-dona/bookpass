var purchase_data = [];
var reccomend_data = [];
var p_list = [];
var r_list3007 = [];
var r_list3008 = [];
var intersection = [];
var tmp = [];
var precision_3007_tmp, precision_3008_tmp, AP_3007_tmp, AP_3008_tmp, MPre_3007, MPre_3008, MAP_3007, MAP_3008;


const MyComponent = {
  data() {
    return {
      text: '',
      reccomend_csv: '',
      purchase_csv: '',
    };
  },
  methods: {
    onSubmit(event) {
      event.preventDefault();
      this.$emit('customSubmit', this.$data.text, this.$data.purchase_csv, this.$data.reccomend_csv);
    }
  },
  template: `
    <form @submit="onSubmit">
    	<div style="display:inline-flex">
    	<form1>
      <div class="box1">
      <br1>購買データ</br1></div>
      <textarea v-model="$data.purchase_csv" placeholder="ActionID, UserID, ItemID"></textarea>
      </form1>
      <form2>
      <div class="box2">
      <br2>レコメンド</br2></div>
      <textarea v-model="$data.reccomend_csv" placeholder="LogicNum, TargetItem, Rank, ReccomendItem"></textarea>
      </form2>
      </div>
    	<p> User ID :
      <input v-model="$data.text" placeholder=　"UserID" type="text" /></p>
      <div class="button_center">
      <button type="submit">OK</button1>
      </div>
    </form>
    
  `
};

new Vue({
  el: '#app',
  components: {
    MyComponent
  },
  data() {
    return {
    	text: '',
      purchase_data,
      reccomend_data,
      reccomend_csv: '',
      purchase_csv: [],
      p_csv:[],
      r_csv: [],
      p_list: [],
      r_list3007: [],
      r_list3008: [],
      intersection: [],
      tmp: [],
      counter : 0,
      precision_3007_tmp : 0, 
      precision_3008_tmp : 0,
      AP_3007_tmp : 0,
      AP_3008_tmp : 0,
      MPre_3007 : 0,
      MAP_3007 : 0,
      MPre_3008 : 0,
      MAP_3008 : 0,
    };
  },
  methods: {
    onSubmit(text,purchase_csv,reccomend_csv) {
    	this.p_csv = purchase_csv.split('\n');
      for(var i=0;i<this.p_csv.length;i++){
      	this.purchase_data.push(this.p_csv[i].split(","))
      }
      this.r_csv = reccomend_csv.split('\n');
      for(var i=0;i<this.r_csv.length;i++){
      	this.reccomend_data.push(this.r_csv[i].split(","))
      }
      
    	for (var x=0;x<(purchase_data.length-10);x++){
      this.tmp=[];
    	this.$data.p_list.push([])
    	this.$data.p_list[x].push(purchase_data[x][2]);
      for(var i = 1 ; i<12 ; i++){
      	if(Number(purchase_data[i][1]) == text){
        	this.tmp.push(purchase_data[i][2])
        }
      }
      this.$data.p_list[x].push(this.tmp);
      
      for(var i = 0 ; i<reccomend_data.length; i++){
      	if(reccomend_data[i][0] == "3007" && reccomend_data[i][1]==this.p_list[x][0]){
      		this.$data.r_list3007.push(reccomend_data[i][3])
        }
      }
      
      for(var i = 0 ; i<reccomend_data.length; i++){
      	if(Number(reccomend_data[i][0]) == 3008 && reccomend_data[i][1]==this.p_list[x][0]){
      	this.$data.r_list3008.push(reccomend_data[i][3])
        }
      }
      
      }
      
      for(var x=0;x<this.p_list.length; x++){
      //Caluculate_Precision and AP sono1
      this.counter = 0;
      this.AP_3007_tmp = 0;
      for(var j = x*10;j<x*10+10; j++){
      	if(this.p_list[x][1].includes( this.r_list3007[j] )){
        	//this.intersection.push(this.r_list3007[j]);
        	this.counter += 1;
          this.AP_3007_tmp += this.counter/(j+1-x*10);
        }
     	}
     	this.precision_3007_tmp = this.counter/10;
      this.AP_3007_tmp /= this.counter;
      
      this.counter = 0;
      this.AP_3008_tmp = 0;
      for(var j = x*10;j<x*10+10; j++){
      	if(this.p_list[x][1].includes( this.r_list3008[j] )){
        	//this.intersection.push(this.r_list3008[j]);
        	this.counter += 1;
          this.AP_3008_tmp += this.counter/(j+1-x*10);
        }
     	}
     	this.precision_3008_tmp = this.counter/10;
      this.AP_3008_tmp /= this.counter;
      //sono1 Fin
      
      this.MPre_3007 += this.precision_3007_tmp;
      this.MAP_3007 += this.AP_3007_tmp;
      this.MPre_3008 += this.precision_3008_tmp;
      this.MAP_3008 += this.AP_3008_tmp;
      }//loop　no owari
      
      this.MPre_3007 /= this.p_list.length
      this.MPre_3008 /= this.p_list.length
      this.MAP_3007 /= this.p_list.length
      this.MAP_3008 /= this.p_list.length
      
    }
  },
  template: `
    <div>
      <MyComponent
        @customSubmit="onSubmit"
      />
<div class="text_center"><p>↓↓↓　結果　↓↓↓</p></div>
<table border = "1">
  <tr>
    <th>指標</th> <th>ロジック</th> <th>スコア</th>
  </tr>

  <tr>
    <td rowspan="2">Precision</td> <td>3007</td> <td> {{ MPre_3007 }} </td>
  </tr>

  <tr>
    <td>3008</td> <td> {{MAP_3007}} </td>
  </tr>
  <tr>
    <td rowspan="2">MAP</td> <td>3007</td> <td> {{MPre_3008}} </td>
  </tr>

  <tr>
    <td>3008</td> <td> {{MAP_3008}} </td>
  </tr>
</table>
  `
});
