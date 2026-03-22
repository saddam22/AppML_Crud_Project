const customerController = {
  init: function(){
    this.customers = JSON.parse(localStorage.getItem("customers")) || [];
    this.filteredCustomers = [...this.customers];
    this.currentPage = 1;
    this.pageSize = 5;
    this.sortField = null;
    this.sortOrder = "asc";

    this.render();

    document.getElementById("addBtn").addEventListener("click", () => this.addRecord());
    document.getElementById("searchBox").addEventListener("input", (e) => this.searchRecords(e.target.value));
    document.getElementById("exportBtn").addEventListener("click", () => this.exportCSV());
  },

  saveData: function(){
    localStorage.setItem("customers", JSON.stringify(this.customers));
  },

  render: function(){
    const start = (this.currentPage - 1) * this.pageSize;
    const paginated = this.filteredCustomers.slice(start, start + this.pageSize);

    const tbody = document.getElementById("tableBody");

    tbody.innerHTML = paginated.map(c => `
      <tr>
        <td class="border px-4 py-2">${c.name}</td>
        <td class="border px-3 py-2">${c.city}</td>
        <td class="border px-4 py-2">
          <button onclick="customerController.editRecord(${c.id})" class="bg-yellow-400 text-white px-2 py-1 rounded">Edit</button>
          <button onclick="customerController.deleteRecord(${c.id})" class="bg-red-500 text-white px-2 py-1 rounded">Delete</button>
        </td>
      </tr>
    `).join('');

    this.renderPagination();
  },

  renderPagination: function(){
    const totalPages = Math.ceil(this.filteredCustomers.length / this.pageSize);
    const pagination = document.getElementById("pagination");
    pagination.innerHTML = '';

    for(let i = 1; i <= totalPages; i++){
      const btn = document.createElement("button");
      btn.textContent = i;
      btn.className = `px-3 py-1 rounded ${i === this.currentPage ? 'bg-blue-500 text-white' : 'bg-gray-200'}`;
      btn.onclick = () => { this.currentPage = i; this.render(); };
      pagination.appendChild(btn);
    }
  },

  addRecord: function(){
    const name = document.getElementById("name").value.trim();
    const city = document.getElementById("city").value.trim();

    if(name && city){
      const newId = this.customers.length
        ? Math.max(...this.customers.map(c => c.id)) + 1
        : 1;

      this.customers.push({id: newId, name, city});
      this.saveData();
      this.searchRecords(document.getElementById("searchBox").value);

      document.getElementById("name").value = "";
      document.getElementById("city").value = "";
    }
  },

  editRecord: function(id){
    const record = this.customers.find(c => c.id === id);

    const newName = prompt("Update Name:", record.name);
    const newCity = prompt("Update City:", record.city);

    if(newName && newCity){
      record.name = newName;
      record.city = newCity;
      this.saveData();
      this.searchRecords(document.getElementById("searchBox").value);
    }
  },

  deleteRecord: function(id){
    if(confirm("Delete this record?")){
      this.customers = this.customers.filter(c => c.id !== id);
      this.saveData();
      this.searchRecords(document.getElementById("searchBox").value);
    }
  },

  searchRecords: function(query){
    query = query.toLowerCase();

    this.filteredCustomers = this.customers.filter(c =>
      c.name.toLowerCase().includes(query) ||
      c.city.toLowerCase().includes(query)
    );

    this.currentPage = 1;
    this.applySorting();
    this.render();
  },

  sortRecords: function(field){
    if(this.sortField === field){
      this.sortOrder = this.sortOrder === "asc" ? "desc" : "asc";
    } else {
      this.sortField = field;
      this.sortOrder = "asc";
    }

    this.applySorting();
    this.render();
  },

  applySorting: function(){
    if(this.sortField){
      this.filteredCustomers.sort((a, b) => {
        let fa = a[this.sortField].toLowerCase();
        let fb = b[this.sortField].toLowerCase();

        if(fa < fb) return this.sortOrder === "asc" ? -1 : 1;
        if(fa > fb) return this.sortOrder === "asc" ? 1 : -1;
        return 0;
      });
    }
  },

  exportCSV: function(){
    const csv = [
      ["Name", "City"],
      ...this.customers.map(c => [c.name, c.city])
    ].map(e => e.join(",")).join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "customers.csv";
    link.click();
  }
};

document.addEventListener("DOMContentLoaded", () => customerController.init());