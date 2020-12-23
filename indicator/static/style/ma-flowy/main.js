document.addEventListener("DOMContentLoaded", function(){
    var rightcard = false;
    var tempblock;
    var tempblock2;

    // ==========[程式初始化，可以不用]==========
//     document.getElementById("blocklist").innerHTML = `
//     <div class="blockelem create-flowy noselect"> <input type="hidden" name="blockelemtype" class="blockelemtype"
//     value="1">
// <div class="grabme"><img src="assets/grabme.svg"></div>
// <div class="blockin">
//     <div class="blockico"><span></span><img src="assets/eye.svg"></div>
//     <div class="blocktext">
//         <p class="blocktitle">購買某商品的受眾</p>
//         <p class="blockdesc">Triggers when somebody visits a specified page</p>
//     </div>
// </div>
// </div>
// <div class="blockelem create-flowy noselect"><input type="hidden" name="blockelemtype" class="blockelemtype"
//         value="2">
//     <div class="grabme"><img src="assets/grabme.svg"></div>
//     <div class="blockin">
//         <div class="blockico"><span></span><img src="assets/action.svg"></div>
//         <div class="blocktext">
//             <p class="blocktitle">點擊某連結的受眾</p>
//             <p class="blockdesc">Triggers when somebody performs a specified action</p>
//         </div>
//     </div>
// </div>
// <div class="blockelem create-flowy noselect"><input type="hidden" name="blockelemtype" class="blockelemtype"
//         value="3">
//     <div class="grabme"><img src="assets/grabme.svg"></div>
//     <div class="blockin">
//         <div class="blockico"><span></span><img src="assets/time.svg"></div>
//         <div class="blocktext">
//             <p class="blocktitle">未點擊某連結的受眾</p>
//             <p class="blockdesc">Triggers after a specified amount of time</p>
//         </div>
//     </div>
// </div>
// <div class="blockelem create-flowy noselect"><input type="hidden" name="blockelemtype" class="blockelemtype"
//         value="4">
//     <div class="grabme"><img src="assets/grabme.svg"></div>
//     <div class="blockin">
//         <div class="blockico"><span></span><img src="assets/error.svg"></div>
//         <div class="blocktext">
//             <p class="blocktitle">Error prompt</p>
//             <p class="blockdesc">Triggers when a specified error happens</p>
//         </div>
//     </div>
// </div>
// `;
    flowy(document.getElementById("canvas"), drag, release, snapping);
    function addEventListenerMulti(type, listener, capture, selector) {
        var nodes = document.querySelectorAll(selector);
        for (var i = 0; i < nodes.length; i++) {
            nodes[i].addEventListener(type, listener, capture);
        }
    }
    function snapping(drag, first) {
        // ==========[放下時觸發]==========
        var grab = drag.querySelector(".grabme");
        grab.parentNode.removeChild(grab);
        var blockin = drag.querySelector(".blockin");
        blockin.parentNode.removeChild(blockin);
        if (drag.querySelector(".blockelemtype").value == "1") {
            drag.innerHTML += "<div class='blockyleft'><img src='assets/eyeblue.svg'><p class='blockyname'>購買商品</p></div><div class='blockyright'><img src='assets/more.svg'></div><div class='blockydiv'></div><div class='blockyinfo'>當會員購買 <span>水氧機</span>時觸發下一流程</div>";
        } else if (drag.querySelector(".blockelemtype").value == "2") {
            drag.innerHTML += "<div class='blockyleft'><img src='assets/eyeblue.svg'><p class='blockyname'>有點擊短連結的會員</p></div><div class='blockyright'><img src='assets/more.svg'></div><div class='blockydiv'></div><div class='blockyinfo'>當會員點擊 <span>精油優惠卷連結</span> 觸發下一流程</div>";
        } else if (drag.querySelector(".blockelemtype").value == "3") {
            drag.innerHTML += "<div class='blockyleft'><img src='assets/eyeblue.svg'><p class='blockyname'>未點擊短連結的會員</p></div><div class='blockyright'><img src='assets/more.svg'></div><div class='blockydiv'></div><div class='blockyinfo'>當會員未點擊 <span>精油優惠卷連結</span> 觸發下一流程</div>";
        } else if (drag.querySelector(".blockelemtype").value == "4") {
            drag.innerHTML += "<div class='blockyleft'><img src='assets/eyeblue.svg'><p class='blockyname'>生日的會員</p></div><div class='blockyright'><img src='assets/more.svg'></div><div class='blockydiv'></div><div class='blockyinfo'>當會員 <span>７天</span> 後生日，觸發下一流程</div>";
        } else if (drag.querySelector(".blockelemtype").value == "5") {
            drag.innerHTML += "<div class='blockyleft'><img src='assets/actionorange.svg'><p class='blockyname'>傳送簡訊</p></div><div class='blockyright'><img src='assets/more.svg'></div><div class='blockydiv'></div><div class='blockyinfo'>發送 <span>精油優惠卷連結</span> 簡訊 </div>";
        } else if (drag.querySelector(".blockelemtype").value == "6") {
            drag.innerHTML += "<div class='blockyleft'><img src='assets/actionorange.svg'><p class='blockyname'>傳送Email</p></div><div class='blockyright'><img src='assets/more.svg'></div><div class='blockydiv'></div><div class='blockyinfo'>會員沒有點擊 <span>精油優惠卷連結</span> </div>";
        } else if (drag.querySelector(".blockelemtype").value == "7") {
            drag.innerHTML += "<div class='blockyleft'><img src='assets/actionorange.svg'><p class='blockyname'>傳送Line訊息</p></div><div class='blockyright'><img src='assets/more.svg'></div><div class='blockydiv'></div><div class='blockyinfo'>Perform <span>Action 1</span></div>";
        } else if (drag.querySelector(".blockelemtype").value == "8") {
            drag.innerHTML += "<div class='blockyleft'><img src='assets/time.svg'><p class='blockyname'>等待幾天</p></div><div class='blockyright'><img src='assets/more.svg'></div><div class='blockydiv'></div><div class='blockyinfo'>等待 <span>７天</span></div>";
        } else if (drag.querySelector(".blockelemtype").value == "9") {
            drag.innerHTML += "<div class='blockyleft'><img src='assets/eyeblue.svg'><p class='blockyname'>未購買商品</p></div><div class='blockyright'><img src='assets/more.svg'></div><div class='blockydiv'></div><div class='blockyinfo'>未購買 <span>精油</span>的會員</div>";
        } 
        return true;
    }
    function drag(block) {
        block.classList.add("blockdisabled");
        tempblock2 = block;
    }
    function release() {
        tempblock2.classList.remove("blockdisabled");
    }
    var disabledClick = function(){

        // ==========[換頁簽時初始化html]==========
        
        document.querySelector(".navactive").classList.add("navdisabled");
        document.querySelector(".navactive").classList.remove("navactive");
        this.classList.add("navactive");
        this.classList.remove("navdisabled");
        if (this.getAttribute("id") == "triggers") {
            // ==========[受眾]==========
            document.getElementById("blocklist").innerHTML = `
            <div class="blockelem create-flowy noselect"><input type="hidden" name="blockelemtype" class="blockelemtype" value="1">
    <div class="grabme"><img src="assets/grabme.svg"></div>
    <div class="blockin">
        <div class="blockico"><span></span><img src="assets/eye.svg"></div>
        <div class="blocktext">
            <p class="blocktitle">1.購買某商品的會員</p>
            <p class="blockdesc">當會員購買某商品時搜集會員名單</p>
        </div>
    </div>
</div>
<div class="blockelem create-flowy noselect"><input type="hidden" name="blockelemtype" class="blockelemtype" value="9">
    <div class="grabme"><img src="assets/grabme.svg"></div>
    <div class="blockin">
        <div class="blockico"><span></span><img src="assets/eye.svg"></div>
        <div class="blocktext">
            <p class="blocktitle">9.未購買某商品的會員</p>
            <p class="blockdesc">當會員未購買某商品時搜集會員名單</p>
        </div>
    </div>
</div>
<div class="blockelem create-flowy noselect"><input type="hidden" name="blockelemtype" class="blockelemtype" value="2">
    <div class="grabme"><img src="assets/grabme.svg"></div>
    <div class="blockin">
        <div class="blockico"><span></span><img src="assets/eye.svg"></div>
        <div class="blocktext">
            <p class="blocktitle">2.有點擊連結的會員</p>
            <p class="blockdesc">有點擊指定連結的會員</p>
        </div>
    </div>
</div>
<div class="blockelem create-flowy noselect"><input type="hidden" name="blockelemtype" class="blockelemtype" value="3">
    <div class="grabme"><img src="assets/grabme.svg"></div>
    <div class="blockin">
        <div class="blockico"><span></span><img src="assets/eye.svg"></div>
        <div class="blocktext">
            <p class="blocktitle">3.未點擊連結的會員</p>
            <p class="blockdesc">尚末點擊指定連結的會員</p>
        </div>
    </div>
</div>
<div class="blockelem create-flowy noselect"><input type="hidden" name="blockelemtype" class="blockelemtype" value="4">
    <div class="grabme"><img src="assets/grabme.svg"></div>
    <div class="blockin">
        <div class="blockico"><span></span><img src="assets/eye.svg"></div>
        <div class="blocktext">
            <p class="blocktitle">4.生日的會員</p>
            <p class="blockdesc">幾天後生日的會員</p>
        </div>
    </div>
</div>

            `;
        } else if (this.getAttribute("id") == "actions") {
            // ==========[動作]==========
            document.getElementById("blocklist").innerHTML = `<div class="blockelem create-flowy noselect"><input type="hidden" name="blockelemtype" class="blockelemtype" value="5">
    <div class="grabme"><img src="assets/grabme.svg"></div>
    <div class="blockin">
        <div class="blockico"><span></span><img src="assets/action.svg"></div>
        <div class="blocktext">
            <p class="blocktitle">5.傳送簡訊</p>
            <p class="blockdesc">透過簡訊傳送短連結</p>
        </div>
    </div>
</div>
<div class="blockelem create-flowy noselect"><input type="hidden" name="blockelemtype" class="blockelemtype" value="6">
    <div class="grabme"><img src="assets/grabme.svg"></div>
    <div class="blockin">
        <div class="blockico"><span></span><img src="assets/action.svg"></div>
        <div class="blocktext">
            <p class="blocktitle">6.傳送Email</p>
            <p class="blockdesc">透過Email傳送短連結</p>
        </div>
    </div>
</div>
<div class="blockelem create-flowy noselect"><input type="hidden" name="blockelemtype" class="blockelemtype" value="7">
    <div class="grabme"><img src="assets/grabme.svg"></div>
    <div class="blockin">
        <div class="blockico"><span></span><img src="assets/action.svg"></div>
        <div class="blocktext">
            <p class="blocktitle">7.傳送Line訊息</p>
            <p class="blockdesc">透過Line傳送短連結</p>
        </div>
    </div>
</div>
`;
        } else if (this.getAttribute("id") == "loggers") {
            // ==========[等待]==========
            document.getElementById("blocklist").innerHTML =  `<div class="blockelem create-flowy noselect"><input type="hidden" name="blockelemtype" class="blockelemtype" value="8">
    <div class="grabme"><img src="assets/grabme.svg"></div>
    <div class="blockin">
        <div class="blockico"><span></span><img src="assets/time.svg"></div>
        <div class="blocktext">
            <p class="blocktitle">8.等待幾天</p>
            <p class="blockdesc">經過幾天後繼續執行流程</p>
        </div>
    </div>
</div>
`;
        }
    }
    addEventListenerMulti("click", disabledClick, false, ".side");
    document.getElementById("close").addEventListener("click", function(){
       if (rightcard) {
           rightcard = false;
           document.getElementById("properties").classList.remove("expanded");
           setTimeout(function(){
                document.getElementById("propwrap").classList.remove("itson"); 
           }, 300);
            tempblock.classList.remove("selectedblock");
       } 
    });
    
document.getElementById("removeblock").addEventListener("click", function(){
 flowy.deleteBlocks();
});
var aclick = false;
var beginTouch = function (event) {
    aclick = true;
}
var checkTouch = function (event) {
    aclick = false;
}
var doneTouch = function (event) {
    if (event.type === "mouseup" && aclick) {
      if (!rightcard && event.target.closest(".block")) {
            tempblock = event.target.closest(".block");
            rightcard = true;
            document.getElementById("properties").classList.add("expanded");
            document.getElementById("propwrap").classList.add("itson");
            tempblock.classList.add("selectedblock");
       } 
    }
}
addEventListener("mousedown", beginTouch, false);
addEventListener("mousemove", checkTouch, false);
addEventListener("mouseup", doneTouch, false);
addEventListenerMulti("touchstart", beginTouch, false, ".block");
});
