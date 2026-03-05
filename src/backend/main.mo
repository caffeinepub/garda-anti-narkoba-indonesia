import Text "mo:core/Text";
import Map "mo:core/Map";
import List "mo:core/List";
import Array "mo:core/Array";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";

actor {
  // Types
  type Message = {
    name : Text;
    email : Text;
    message : Text;
    timestamp : Int;
  };

  type Article = {
    title : Text;
    content : Text;
    author : Text;
    date : Int;
    category : Text;
  };

  type Program = {
    name : Text;
    description : Text;
    kind : Text;
  };

  type Volunteer = {
    name : Text;
    email : Text;
    phone : Text;
    city : Text;
    motivation : Text;
    status : Text;
  };

  type SiteSettings = {
    orgName : Text;
    tagline : Text;
    address : Text;
    phone : Text;
    email : Text;
    facebookUrl : Text;
    twitterUrl : Text;
    instagramUrl : Text;
    youtubeUrl : Text;
    headerCtaText : Text;
    footerNote : Text;
    headerSubtitle : Text;
  };

  type Location = {
    id : Text;
    nama : Text;
    alamat : Text;
    kota : Text;
    provinsi : Text;
    latitude : Float;
    longitude : Float;
    tanggalKegiatan : Text;
    jumlahPeserta : Int;
    keterangan : Text;
  };

  type GalleryItem = {
    id : Text;
    judul : Text;
    deskripsi : Text;
    tipe : Text; // "foto" or "video"
    url : Text;
    tanggal : Int;
  };

  type UserProfile = {
    name : Text;
    email : Text;
    phone : Text;
  };

  // Persistence
  let messages = List.empty<Message>();
  let articles = List.empty<Article>();
  let programs = List.empty<Program>();
  let volunteers = Map.empty<Text, Volunteer>();
  let locations = Map.empty<Text, Location>();
  let galleryItems = Map.empty<Text, GalleryItem>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  var siteSettings : SiteSettings = {
    orgName = "GARDA Anti Narkoba Indonesia";
    tagline = "Bersama Melawan Narkoba, Selamatkan Generasi Bangsa";
    address = "Jl. Sudirman No. 123, Jakarta Pusat";
    phone = "+62 21 5000 1234";
    email = "info@gardaantinarkoba.id";
    facebookUrl = "";
    twitterUrl = "";
    instagramUrl = "";
    youtubeUrl = "";
    headerCtaText = "";
    footerNote = "";
    headerSubtitle = "";
  };

  // Authorization
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // User Profile Management
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Messaging
  public shared ({ caller }) func sendMessage(name : Text, email : Text, message : Text, timestamp : Int) : async () {
    let newMessage : Message = {
      name;
      email;
      message;
      timestamp;
    };
    messages.add(newMessage);
  };

  public query ({ caller }) func getMessages() : async [Message] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Admin access required");
    };
    messages.toArray();
  };

  // Article Management
  public shared ({ caller }) func addArticle(title : Text, content : Text, author : Text, date : Int, category : Text) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Admin access required");
    };
    let newArticle : Article = {
      title;
      content;
      author;
      date;
      category;
    };
    articles.add(newArticle);
  };

  public query ({ caller }) func getArticles() : async [Article] {
    articles.toArray();
  };

  public query ({ caller }) func getArticlesByCategory(category : Text) : async [Article] {
    articles.toArray().filter(func(article) { article.category == category });
  };

  public shared ({ caller }) func deleteArticle(title : Text) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Admin access required");
    };
    let filteredArticles = articles.toArray().filter(func(article) { article.title != title });
    articles.clear();
    filteredArticles.forEach(func(article) { articles.add(article) });
  };

  public shared ({ caller }) func updateArticle(title : Text, newTitle : Text, content : Text, author : Text, category : Text) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Admin access required");
    };
    let updatedArticles = articles.toArray().map(
      func(article) {
        if (article.title == title) {
          {
            title = newTitle;
            content;
            author;
            date = article.date;
            category;
          };
        } else {
          article;
        };
      }
    );
    articles.clear();
    updatedArticles.forEach(func(article) { articles.add(article) });
  };

  // Program Management
  public shared ({ caller }) func addProgram(name : Text, description : Text, kind : Text) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Admin access required");
    };
    let newProgram : Program = {
      name;
      description;
      kind;
    };
    programs.add(newProgram);
  };

  public query ({ caller }) func getPrograms() : async [Program] {
    programs.toArray();
  };

  public query ({ caller }) func getProgramsByKind(kind : Text) : async [Program] {
    programs.toArray().filter(func(program) { program.kind == kind });
  };

  public shared ({ caller }) func deleteProgram(name : Text) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Admin access required");
    };
    let filteredPrograms = programs.toArray().filter(func(program) { program.name != name });
    programs.clear();
    filteredPrograms.forEach(func(program) { programs.add(program) });
  };

  public shared ({ caller }) func updateProgram(name : Text, newName : Text, description : Text, kind : Text) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Admin access required");
    };
    let updatedPrograms = programs.toArray().map(
      func(program) {
        if (program.name == name) {
          {
            name = newName;
            description;
            kind;
          };
        } else {
          program;
        };
      }
    );
    programs.clear();
    updatedPrograms.forEach(func(program) { programs.add(program) });
  };

  // Volunteer Registration & Management
  public shared ({ caller }) func registerVolunteer(name : Text, email : Text, phone : Text, city : Text, motivation : Text) : async () {
    let newVolunteer : Volunteer = {
      name;
      email;
      phone;
      city;
      motivation;
      status = "pending";
    };
    volunteers.add(email, newVolunteer);
  };

  public query ({ caller }) func getVolunteers() : async [Volunteer] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Admin access required");
    };
    volunteers.values().toArray();
  };

  public query ({ caller }) func getVolunteersByStatus(status : Text) : async [Volunteer] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Admin access required");
    };
    volunteers.values().toArray().filter(func(volunteer) { volunteer.status == status });
  };

  public shared ({ caller }) func approveVolunteer(email : Text) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Admin access required");
    };
    switch (volunteers.get(email)) {
      case (null) { Runtime.trap("Volunteer not found") };
      case (?volunteer) {
        let updatedVolunteer = { volunteer with status = "approved" };
        volunteers.add(email, updatedVolunteer);
      };
    };
  };

  public shared ({ caller }) func rejectVolunteer(email : Text) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Admin access required");
    };
    switch (volunteers.get(email)) {
      case (null) { Runtime.trap("Volunteer not found") };
      case (?volunteer) {
        let updatedVolunteer = { volunteer with status = "rejected" };
        volunteers.add(email, updatedVolunteer);
      };
    };
  };

  public shared ({ caller }) func deleteVolunteer(email : Text) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Admin access required");
    };
    if (not volunteers.containsKey(email)) {
      Runtime.trap("Volunteer not found");
    };
    volunteers.remove(email);
  };

  // Site Settings
  public query ({ caller }) func getSiteSettings() : async SiteSettings {
    siteSettings;
  };

  public shared ({ caller }) func updateSiteSettings(
    orgName : Text,
    tagline : Text,
    address : Text,
    phone : Text,
    email : Text,
    facebookUrl : Text,
    twitterUrl : Text,
    instagramUrl : Text,
    youtubeUrl : Text,
    headerCtaText : Text,
    footerNote : Text,
    headerSubtitle : Text,
  ) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Admin access required");
    };
    siteSettings := {
      orgName;
      tagline;
      address;
      phone;
      email;
      facebookUrl;
      twitterUrl;
      instagramUrl;
      youtubeUrl;
      headerCtaText;
      footerNote;
      headerSubtitle;
    };
  };

  public query ({ caller }) func isAdmin() : async Bool {
    AccessControl.isAdmin(accessControlState, caller);
  };

  // Location Management
  public shared ({ caller }) func addLocation(location : Location) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Admin access required");
    };
    locations.add(location.id, location);
  };

  public shared ({ caller }) func deleteLocation(id : Text) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Admin access required");
    };
    if (not locations.containsKey(id)) {
      Runtime.trap("Location not found");
    };
    locations.remove(id);
  };

  public query ({ caller }) func getLocations() : async [Location] {
    locations.values().toArray();
  };

  // Gallery Management
  public shared ({ caller }) func addGalleryItem(item : GalleryItem) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Admin access required");
    };
    galleryItems.add(item.id, item);
  };

  public shared ({ caller }) func deleteGalleryItem(id : Text) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Admin access required");
    };
    if (not galleryItems.containsKey(id)) {
      Runtime.trap("Gallery item not found");
    };
    galleryItems.remove(id);
  };

  public query ({ caller }) func getGalleryItems() : async [GalleryItem] {
    galleryItems.values().toArray();
  };
};
