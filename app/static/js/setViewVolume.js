function createVolumeSlider(source,i) {
    var gainNode = context.createGain();
    
    gainNode.gain.value = buffers[i].volume || 1;
    console.log(i,buffers[i].volume);
    console.log(i,gainNode.gain.value);
    
    source.connect(gainNode);
    gainNode.connect(context.destination);

    var input = document.createElement("input");
    input.type = "range";
    input.min="0";
    input.max="400";
    input.value = String(gainNode.gain.value*100);
    input.step="1";
    input.className = "volumeSlider"; // set the CSS class
    
    $(input).change(function(){
        gainNode.gain.value = $(this).val()/100.0;
        buffers[i].volume = gainNode.gain.value;
        console.log(gainNode.gain.value);
    });

    
    $("#VolumeBox").append(input);

}




function setUpVolumeNodes(source,i) {
    var c=document.createElement("canvas");
    $(c).css("display","inline-block");
    var ctx=c.getContext("2d");
    var gradient = ctx.createLinearGradient(0,0,0,300);
    gradient.addColorStop(1,'#000000');
    gradient.addColorStop(0.75,'#ff0000');
    gradient.addColorStop(0.25,'#ffff00');
    gradient.addColorStop(0,'#ffffff');
 
        // setup a javascript node
        javascriptNode = context.createScriptProcessor(2048, 1, 1);
        // connect to destination, else it isn't called
        javascriptNode.connect(context.destination);
 
        // setup a analyzer
        var analyser = context.createAnalyser();
        analyser.smoothingTimeConstant = 0.3;
        analyser.fftSize = 1024;
  
        // connect the source to the analyser
        source.connect(analyser);
 
        // we use the javascript node to draw at a specific interval.
        analyser.connect(javascriptNode);
 
        // and connect to destination, if you want audio

       createVolumeSlider(source,i);
       $("#VolumeBox").append(c);


  // when the javascript node is called
    // we use information from the analyzer node
    // to draw the volume
    javascriptNode.onaudioprocess = function() {
 
        // get the average, bincount is fftsize / 2
        var array =  new Uint8Array(analyser.frequencyBinCount);
        analyser.getByteFrequencyData(array);
        var average = getAverageVolume(array)
 
        // clear the current state
        ctx.clearRect(0, 0, 60, 130);
 
        // set the fill style
        ctx.fillStyle=gradient;
 
        // create the meters
        ctx.fillRect(0,130-average,25,130);
    }
 
    function getAverageVolume(array) {
        var values = 0;
        var average;
 
        var length = array.length;
 
        // get all the frequency amplitudes
        for (var i = 0; i < length; i++) {
            values += array[i];
        }
 
        average = values / length;
        return average;
    }

    }






function clearVolumeSlider() {
    $("#VolumeBox").empty();

}