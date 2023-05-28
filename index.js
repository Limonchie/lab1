function resizeImage(files) {
	var img = document.createElement("img");
	var reader = new FileReader();
	reader.onload = function(e) { 
		img.src = e.target.result;
		img.onload = function() {
			var canvas = document.createElement("canvas");
	        var ctx = canvas.getContext("2d");
	        ctx.drawImage(img, 0, 0);

	        var MAX_WIDTH = 200;
	        var MAX_HEIGHT = 200;
	        var width = img.width;
	        var height = img.height;

	        if (width > height) {
	          if (width > MAX_WIDTH) {
	            height *= MAX_WIDTH / width;
	            width = MAX_WIDTH;
	          }
	        } else {
	          if (height > MAX_HEIGHT) {
	            width *= MAX_HEIGHT / height;
	            height = MAX_HEIGHT;
	          }
	        }
	        canvas.width = width;
	        canvas.height = height;
	        var ctx = canvas.getContext("2d");
	        ctx.drawImage(img, 0, 0, width, height);
	        var dataurl = canvas.toDataURL("image/png");   
	        document.getElementById('image').src = dataurl; 
         
        };

	};
	reader.readAsDataURL(files[0]);
}	

async function init(files) {
	p = document.getElementById('result');
	p.innerHTML = "Работаем...";
	const URL = "model/";
	const modelURL = URL + "model.json";
	const metadataURL = URL + "metadata.json";
	resizeImage(files);

    model = await tmImage.load(modelURL, metadataURL);
    predict();
}

async function predict() {
	
    const predictions = await model.predict(document.getElementById('image'));
	p.innerHTML = "";
	p.innerHTML += '\
	<div class="alert alert-success" role="alert">\
  	Птица определена!\
	</div>';
	
	for (let prediction of predictions) {
		let predict = Math.round(prediction.probability*100);
		if(predict >= 90) {
			
			 
	        	p.innerHTML += 
				'\
				<div class="media border py-3 border-primary rounded">\
				  <div class="media-body">\
				    <h5 class="mt-0">'+prediction.className+" ("+predict+"% вероятности)"+'</h5>\
				  </div>\
				</div>\
				';
			    
			  
	        	

		}
    }
    if(!p.innerHTML.match(/% вероятности/))
    	p.innerHTML = "Птица не определена";
}