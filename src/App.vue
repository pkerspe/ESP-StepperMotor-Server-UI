<template>
  <div id="app" class="row">
    <!-- Main Sidebar -->
    <aside class="main-sidebar col-10 col-md-3 col-lg-2 px-0" v-bind:class="{ open: this.isOpen }">
      <div class="main-navbar">
        <nav
          class="navbar align-items-stretch navbar-light bg-white flex-md-nowrap border-bottom p-0 logo-bg"
        >
          <a class="navbar-brand mr-0" href="#" style="line-height: 12px;width:90%;height:100%;"></a>
          <a class="navbar-brand mr-0 pr-3 d-md-none" href="#" v-on:click="hideMenu">
            <font-awesome-icon icon="times" size="lg" />
          </a>
        </nav>
      </div>
      <div class="nav-wrapper">
        <ul class="nav flex-column">
          <li class="nav-item" v-on:click="hideMenu">
            <router-link to="/" class="nav-link">
              <font-awesome-icon icon="tachometer-alt" /> Home
            </router-link>
          </li>
          <li class="nav-item" v-on:click="hideMenu">
            <router-link to="/control" class="nav-link">
              <font-awesome-icon icon="gamepad" /> Control
            </router-link>
          </li>
          <li class="nav-item" v-on:click="hideMenu">
            <router-link to="/setup" class="nav-link">
              <font-awesome-icon icon="cogs" /> Setup
            </router-link>
          </li>
          <li class="nav-item" v-on:click="hideMenu">
            <router-link to="/about" class="nav-link">
              <font-awesome-icon icon="info-circle" /> About
            </router-link>
          </li>
        </ul>
      </div>
    </aside>
    <!-- End Main Sidebar -->
    <main class="main-content col-lg-10 col-md-9 col-sm-12 p-0 offset-lg-2 offset-md-3">
      <div class="main-navbar sticky-top bg-white">
        <!-- Main Navbar -->
        <nav class="navbar align-items-stretch navbar-light flex-md-nowrap p-0">
          <div sytle="display:block;">
            <div class="page-title pl-4 pt-2" id="header-title-from-content">ESP-StepperMotor-Server</div>
            <div
              id="header-description-from-content"
              class="small pl-4 pt-2 overflow-hidden d-none d-md-block"
            ></div>
          </div>
          <nav class="nav">
            <a
              href="#"
              v-on:click="toggleNavbar"
              class="nav-link nav-link-icon d-md-none d-xs-inline text-center border-left"
            >
              <font-awesome-icon icon="bars" size="2x" />
            </a>
          </nav>
        </nav>
      </div>
      <!-- / .main-navbar -->
      <div class="main-content-container container-fluid px-4">
        <div class="row">
          <div class="col-sm-12">
            <router-view />
          </div>
        </div>
      </div>
      <footer class="main-footer d-flex flex-row-reverse p-2 px-3 bg-white border-top mt-4">
        <div class="align-content-end">
          <font-awesome-icon
            icon="dot-circle"
            v-bind:class="{statusOnline: isOnline, statusOffline: !isOnline}"
          />
          {{onlineSatusText}}
          <span>(UI version: {{serverUIVersion}} / Server version: {{serverVersion}})</span>
        </div>
      </footer>
    </main>
  </div>
</template>

<style>
.main-footer {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
}

.main-content-container {
  padding-bottom: 60px;
}

.nav-link {
  font-size: 1.5rem !important;
}

.logo-bg {
  background-image: url("./assets/logo.svg");
  background-position: left;
  background-size: contain;
  background-repeat: no-repeat;
  margin: 5px;
}

.statusOffline {
  color: red;
}

.statusOnline {
  color: green;
}
</style>

<script>
/* eslint-disable no-console */
import { ApiService } from "./services/ApiService";

const apiService = new ApiService();

export default {
  data: function() {
    return {
      isOpen: false,
      isOnline: false,
      onlineSatusText: "trying to connect to server",
      serverUIVersion: window.serverUIVersion,
      serverStatus: { version: "unknown" },
      serverVersion: "N/A"
    };
  },
  methods: {
    toggleNavbar: function() {
      this.isOpen = !this.isOpen;
    },
    hideMenu: function() {
      this.isOpen = false;
    },
    getOnlineStatus() {
      console.log("polling for status");
      apiService
        .getServerStatus()
        .then(data => {
          this.serverStatus = data;
          if (this.serverStatus && this.serverStatus.version) {
            this.serverVersion = this.serverStatus.version;
            if (!this.isOnline) {
              this.isOnline = true;
              this.onlineSatusText = "connected";
              this.$toastr.success(
                "Connected to ESP-StepperMotor-Server",
                "Connection established",
                { timeOut: 1500 }
              );
            }
          } else {
            console.log("invalid server response from status endpoint. Will try again later");
          }
          setTimeout(() => {
            this.getOnlineStatus();
          }, 10000);
        })
        .catch(error => {
          console.log("error while trying to get server status", error);
          if (this.isOnline) {
            this.isOnline = false;
            this.serverVersion = "N/A";
            this.onlineSatusText = "disconnected";
            this.$toastr.error(
              "Failed to connect to ESP-StepperMotor-Server",
              "Not connected",
              {}
            );
          }
          //set higher polling frequency for status, to check when server is back
          setTimeout(() => {
            this.getOnlineStatus();
          }, 1000);
        });
    }
  },
  mounted() {
    this.getOnlineStatus();
  }
};
</script>
