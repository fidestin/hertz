function displayTime() {
    var str = "";

    var currentTime = new Date()
    var hours = currentTime.getHours()
    var minutes = currentTime.getMinutes()
    var seconds = currentTime.getSeconds()
	var millseconds = currentTime.getMilliseconds()

    if (minutes < 10) {
        minutes = "0" + minutes
    }
    if (seconds < 10) {
        seconds = "0" + seconds
    }
    str += hours + ":" + minutes + ":" + seconds + ":" + millseconds + " " ;
    if(hours > 11){
        str += "PM"
    } else {
        str += "AM"
    }
    return str;
}


StopWatch = function()
{
    this.StartMilliseconds = 0;
    this.ElapsedMilliseconds = 0;
}  

StopWatch.prototype.Start = function()
{
    this.StartMilliseconds = new Date().getTime();
}

StopWatch.prototype.Stop = function()
{
    this.ElapsedMilliseconds = new Date().getTime() - this.StartMilliseconds;
}