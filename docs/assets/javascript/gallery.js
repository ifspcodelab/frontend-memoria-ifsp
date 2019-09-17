// Item Class
var Item = function (id, type, name, description, picture) {
    this.id = id;
    this.type = type;
    this.name = name;
    this.description = description;
    this.picture = picture;
    this.visible = true;
    this.image = null;
  };
  
  Item.prototype.changeDisplay = function () {
    if(this.visible) {
      this.picture.style.display = "block";
    } else {
      this.picture.style.display = "none";
    }
  };
  
  Item.prototype.loadOriginalImage = function(src) {
    //load only if is not cache
    if(this.image == null) {
      this.image = new Image();
      this.image.src = src;
    }
  };
  
  Item.prototype.getCompleteItem = function(src) {
    this.loadOriginalImage(src);
   
    var completeItem = document.createElement('div');
    completeItem.appendChild(this.image);
    
    if(this.name) {
      var nameNode = document.createElement('h2');
      nameNode.appendChild(document.createTextNode(this.name));
      completeItem.appendChild(nameNode);
    }
    
    if(this.description) {
      var descriptionNode = document.createElement('p');
      descriptionNode.appendChild(document.createTextNode(this.description));
      completeItem.appendChild(descriptionNode);
    }
  
    return completeItem;
  }
  
  
  // Gallery Class
  var Gallery = function (idElement, idFilter, modal) {
    this.element = document.querySelector(idElement);
    this.filterElement = document.querySelector(idFilter)
    this.imgPath = this.element.getAttribute('data-img-path');
    this.imgName = this.element.getAttribute('data-img-name');
    this.modal = modal;
    this.itens = [];
    this.loadItens();
    this.registerEvents();
  };
  
  Gallery.prototype.loadItens = function () {
    var children = this.element.children;
    for (i = 0; i < children.length; i++) {
      this.itens.push(
        new Item(
          children[i].getAttribute('data-id'),
          children[i].getAttribute('data-type'),
          children[i].getAttribute('data-name'),
          children[i].getAttribute('data-description'),
          children[i]
        )
      );
    }
  };
  
  Gallery.prototype.registerEvents = function () {
    this.filterElement.addEventListener('click', this.filter.bind(this));
    this.element.addEventListener('click', this.openItem.bind(this));
  };
  
  Gallery.prototype.getItem = function(i) {
    return this.itens.filter(function(item){
      return item.id == i;
    })[0];
  }
  
  Gallery.prototype.render = function () {
    this.itens.forEach(function(item){ 
      item.changeDisplay(); 
    });
  };
  
  Gallery.prototype.filter = function (e) {
    if (e.target.className == 'filter') {
         
      this.changeFilter(e.target.parentNode);
  
      var type = e.target.dataset.filter;
      
      if (type === 'all') {
        this.itens.forEach(function(item){ 
          item.visible = true;
        });
      } else {
        this.itens.forEach(function(item){ 
          if (item.type === type)
            item.visible = true;
          else
            item.visible = false;
        });
      }
  
      this.render();
    }
  };
  
  Gallery.prototype.changeFilter = function(item) {
    for (var i = 0; i < this.filterElement.children.length; i++) {
      this.filterElement.children[i].classList.remove('active');
    }
    item.classList.add('active');
  }
  
  Gallery.prototype.openItem = function(e) {
    if(e.target.tagName === 'IMG') {
      var id = e.target.parentNode.parentNode.dataset.id;
      var item = this.getItem(id);
      var src = this.imgPath + id + this.imgName
      this.modal.loadContent(item.getCompleteItem(src));
    }
  }
  
  // Modal Class
  var Modal = function(idElement, idContent, idCloseBtn) {
    this.element = document.querySelector(idElement);
    this.content = document.querySelector(idContent);
    this.closeBtn = this.element.querySelector(idCloseBtn);
    this.registerEvents();
  };
  
  Modal.prototype.open = function() {
    this.element.style.display = 'block';
  };
  
  Modal.prototype.close = function() {
    this.element.style.display = 'none';
  };
  
  Modal.prototype.loadContent = function(item) {
    this.content.firstChild.remove();
    this.content.appendChild(item);
    this.open();
  };
  
  Modal.prototype.registerEvents = function() {
    this.closeBtn.addEventListener('click', this.close.bind(this));
  
    var self = this;
    window.addEventListener('click', function(e) {
      if(e.target == self.element)
        self.close();
    });
  
  };
  
  var modal = new Modal('#main-gallery-modal', '#main-gallery-modal-content', '#main-gallery-modal-close');
  var mainGallery = new Gallery('#main-gallery', '#main-gallery-filter', modal);

  