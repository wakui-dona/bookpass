const apiURL = "https://stg-bookpass-recommend-api.team-rec.jp/recommend.csv?user_id=0001759628&frame_id=9998&item_id=BT000026070107407401"

var purchase_data = [];
var reccomend_data = [];
var tmp = [];

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
    	<div class="text_center">
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
      r_list_tmp: [],
      r_list: [],
      r_list_tmp_tmp: [],
      logic_list: [],
      tmp: [],
      counter : 0,
      precision_tmp : 0, 
      AP_tmp : 0,
      MPre : [],
      MAP : [],
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
      for(var i=0;i<reccomend_data.length;i++){
      	this.logic_list.push(this.reccomend_data[i][0])
      }
	var set = new Set(this.logic_list);
	this.logic_list = Array.from(set)

	for (var x = 0 ; x < (purchase_data.length-10) ; x++){
      	this.tmp=[];
    		this.$data.p_list.push([])
    		this.$data.p_list[x].push(purchase_data[x][2]);
      	for(var i = 1 ; i < purchase_data.length ; i++){
      		if(Number(purchase_data[i][1]) == text){
        		this.tmp.push(purchase_data[i][2])
        	}
      	}
      	this.$data.p_list[x].push(this.tmp);
      
      	for(var logic = 0 ; logic<this.logic_list.length ; logic++){
      		for(var i = 0 ; i < reccomend_data.length ; i++){
      			if(reccomend_data[i][0] == this.logic_list[logic] && reccomend_data[i][1] == this.p_list[x][0]){
      				this.$data.r_list_tmp.push(reccomend_data[i][3]);
        		}
      		}
      		this.r_list_tmp_tmp.push(this.$data.r_list_tmp);
      		this.$data.r_list_tmp = [];
      	}
      
      	this.r_list.push(this.$data.r_list_tmp_tmp);
      	this.$data.r_list_tmp_tmp = [];
      	}

	for(var logic = 0 ; logic < this.logic_list.length ; logic++){
      		for(var x = 0 ; x < this.p_list.length ; x++){
      		//Caluculate_Precision and AP 1loop
     				this.counter = 0;
      			this.AP_tmp = 0;
      			for(var j = 0 ; j < 10 ; j++){
      				if(this.p_list[x][1].includes( this.r_list[x][logic][j] )){
        				this.counter += 1;
          			this.AP_tmp += this.counter / (j+1);
        			}
     				}
     				this.precision_tmp = this.counter/10;
      			this.AP_tmp /= this.counter;
      			//1loop Fin
      
      			this.MPre.push(0);
      			this.MPre[logic] += this.precision_tmp;
      			this.MAP.push(0);
      			this.MAP[logic] += this.AP_tmp;
      		}
      //loop　no owari
      		this.MPre[logic] /= this.p_list.length
     
      		this.MAP[logic] /= this.p_list.length
      
      	}
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
    			<th>ロジック</th> <th>Precision</th> <th>MAP</th>
  			</tr>

				<tr v-for="(logic_num, index) in logic_list">
    			<td>{{ logic_num }} </td> <td> {{ MPre[index] }} </td> <td> {{MAP[index]}} </td>
  			</tr>
  
			</table>
  `
});
