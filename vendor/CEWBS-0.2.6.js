!function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a="function"==typeof require&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}for(var i="function"==typeof require&&require,o=0;o<r.length;o++)s(r[o]);return s}({1:[function(require,module){var meshers={greedy:require("./meshers/greedy_tri.js").mesher},CEWBS=window.CEWBS={};CEWBS.Util=require("./helpers/util.js"),CEWBS.version="0.2.6",CEWBS.VoxelMesh=function(name,scene){BABYLON.Mesh.call(this,name,scene),this.noVoxels=!0,this.oldVisibility=!0,this.transparentMesh=new BABYLON.Mesh(name+"-tsp",scene),this.transparentMesh.noVoxels=!0,this.transparentMesh.oldVisibility=!0,this.transparentMesh.hasVertexAlpha=!0,this.transparentMesh.parent=this,this.transparentMesh.root=this,this.root=this},CEWBS.VoxelMesh.prototype=Object.create(BABYLON.Mesh.prototype),CEWBS.VoxelMesh.prototype.hasTransparency=!1,CEWBS.VoxelMesh.prototype.constructor=CEWBS.VoxelMesh,CEWBS.VoxelMesh.prototype.mesher=meshers.greedy,CEWBS.VoxelMesh.prototype.evaluateFunction=function(id){return!!id},CEWBS.VoxelMesh.prototype.coloringFunction=function(id){return[id/5,id/5,id/5]},CEWBS.VoxelMesh.prototype.setVoxelAt=function(pos,id,meta){return null!=this.voxelData.voxels&&Array.isArray(pos)?(this.voxelData.voxels[this.positionToIndex(pos)]=[id,meta],!0):"Error: please set the dimensions of the voxelData first!"},CEWBS.VoxelMesh.prototype.setMetaAt=function(pos,meta){if(null!=this.voxelData.voxels&&Array.isArray(pos)){var index=this.positionToIndex(pos);if(Array.isArray(this.voxelData.voxels[index]))return this.voxelData.voxels[this.positionToIndex(pos)][1]=meta,!0}return"Error: please set the dimensions of the voxelData first!"},CEWBS.VoxelMesh.prototype.setVoxelBatch=function(voxels,id,meta){for(var i=0;i<voxels.length;i++){var voxel=voxels[i];voxel.length<4&&null!=meta?this.setVoxelAt(voxel,id,meta):voxel.length<5&&null!=meta?this.setVoxelAt(voxel,voxel[3],meta):this.setVoxelAt(voxel,voxel[3],voxel[4])}},CEWBS.VoxelMesh.prototype.getVoxelAt=function(pos){return null!=this.voxelData.voxels?this.voxelData.voxels[this.positionToIndex(pos)]:"Error: please set the dimensions of the voxelData first!"},CEWBS.VoxelMesh.prototype.setVoxelData=function(voxelData){this.voxelData=voxelData},CEWBS.VoxelMesh.prototype.getVoxelData=function(){return this.voxelData},CEWBS.VoxelMesh.prototype.setDimensions=function(dims){return Array.isArray(dims)&&3===dims.length?(null==this.voxelData&&(this.voxelData={}),this.voxelData.dimensions=dims,null==this.voxelData.voxels&&(this.voxelData.voxels=new Array(dims[0]*dims[1]*dims[2])),void 0):"Error: dimensions must be an array [x,y,z]"},CEWBS.VoxelMesh.prototype.indexToPosition=function(i){return[i%this.voxelData.dimensions[0],Math.floor(i/this.voxelData.dimensions[0]%this.voxelData.dimensions[1]),Math.floor(i/(this.voxelData.dimensions[1]*this.voxelData.dimensions[0]))]},CEWBS.VoxelMesh.prototype.positionToIndex=function(pos){return pos[0]+pos[1]*this.voxelData.dimensions[0]+pos[2]*this.voxelData.dimensions[0]*this.voxelData.dimensions[1]},CEWBS.VoxelMesh.prototype.updateMesh=function(passID){null==passID&&(passID=0);for(var rawMesh=this.mesher(this.voxelData.voxels,this.voxelData.dimensions,this.evaluateFunction,passID),indices=[],colors=[],i=0;i<rawMesh.faces.length;++i){var q=rawMesh.faces[i];indices.push(q[2],q[1],q[0]);var color=this.coloringFunction(q[3],q[4]);null==color||color.length<3?color=[300,75,300,255]:3===color.length&&color.push(255);for(var i2=0;3>i2;i2++)colors[4*q[i2]]=color[0]/255,colors[4*q[i2]+1]=color[1]/255,colors[4*q[i2]+2]=color[2]/255,colors[4*q[i2]+3]=color[3]/255}var vertexData=new BABYLON.VertexData;vertexData.positions=rawMesh.vertices,vertexData.indices=indices,vertexData.normals=rawMesh.normals,vertexData.colors=colors,passID?1===passID&&(vertexData.positions.length>0?(this.transparentMesh.noVoxels===!0&&(this.transparentMesh.isVisible=this.transparentMesh.oldVisibility,this.transparentMesh.noVoxels=!1),vertexData.applyToMesh(this.transparentMesh,1),this.transparentMesh._updateBoundingInfo()):(this.transparentMesh.noVoxels=!0,this.transparentMesh.oldVisibility=this.transparentMesh.isVisible,this.transparentMesh.isVisible=!1)):vertexData.positions.length>0?(this.noVoxels===!0&&(this.isVisible=this.oldVisibility,this.noVoxels=!1),vertexData.applyToMesh(this,1),this._updateBoundingInfo(),this.hasTransparency&&this.updateMesh(1)):(this.noVoxels=!0,this.oldVisibility=this.isVisible,this.isVisible=!1)},CEWBS.VoxelMesh.prototype.originToCenterOfBounds=function(ignoreY){var pivot=[-this.voxelData.dimensions[0]/2,-this.voxelData.dimensions[1]/2,-this.voxelData.dimensions[2]/2];ignoreY&&(pivot[1]=0),this.setPivot(pivot)},CEWBS.VoxelMesh.prototype.setPivot=function(pivot){var babylonPivot=BABYLON.Matrix.Translation(pivot[0],pivot[1],pivot[2]);this.setPivotMatrix(babylonPivot)},CEWBS.VoxelMesh.prototype.exportVoxelData=function(){for(var convertedVoxels=[],i=0;i<this.voxelData.voxels.length;i++){var voxel=this.voxelData.voxels[i];if(null!=voxel){var pos=this.indexToPosition(i);pos.push(voxel[0]),pos.push(voxel[1]),convertedVoxels.push(pos)}}return{dimensions:this.voxelData.dimensions,voxels:convertedVoxels}},CEWBS.VoxelMesh.prototype.importZoxel=function(zoxelData){var cewbsData={};cewbsData.dimensions=[zoxelData.width,zoxelData.height,zoxelData.depth],cewbsData.voxels=JSON.parse(JSON.stringify(zoxelData.frame1));for(var i=0;i<cewbsData.voxels.length;i++)cewbsData.voxels[i][3]=cewbsData.voxels[i][3]/100;this.coloringFunction=function(id){return CEWBS.Util.hex2rgb((100*id).toString(16))},this.setDimensions(cewbsData.dimensions),this.setVoxelBatch(cewbsData.voxels,16777215,0)},CEWBS.VoxelMesh.prototype.exportZoxel=function(){var cewbsData=this.exportVoxelData(),zoxelData={};zoxelData.creator="CEWBS Exporter",zoxelData.width=cewbsData.dimensions[0],zoxelData.height=cewbsData.dimensions[1],zoxelData.depth=cewbsData.dimensions[2],zoxelData.version=1,zoxelData.frames=1,zoxelData.frame1=cewbsData.voxels;for(var i=0;i<zoxelData.frame1.length;i++){var hexColor=CEWBS.Util.rgb2hex(this.coloringFunction(zoxelData.frame1[i][3],zoxelData.frame1[i][4]));zoxelData.frame1[i][3]=hexColor.length<=6?parseInt(hexColor+"FF",16):parseInt(hexColor,16)}return zoxelData},CEWBS.VoxelMesh.handlePick=function(pickResult){var mesh=pickResult.pickedMesh.root,point=pickResult.pickedPoint,m=new BABYLON.Matrix;mesh.getWorldMatrix().invertToRef(m);var x,y,z,voxel1,voxel2,v=BABYLON.Vector3.TransformCoordinates(point,m),offsetX=+(v.x-v.x.toFixed(0)).toFixed(4),offsetY=+(v.y-v.y.toFixed(0)).toFixed(4),offsetZ=+(v.z-v.z.toFixed(0)).toFixed(4);return 0===offsetX?(x=Math.round(v.x),y=Math.floor(v.y),z=Math.floor(v.z),x>=mesh.voxelData.dimensions[0]&&(x=mesh.voxelData.dimensions[0]-1),voxel1=[x,y,z],voxel2=[x-1,y,z]):0===offsetY?(x=Math.floor(v.x),y=Math.round(v.y),z=Math.floor(v.z),y>=mesh.voxelData.dimensions[1]&&(y=mesh.voxelData.dimensions[1]-1),voxel1=[x,y,z],voxel2=[x,y-1,z]):0===offsetZ&&(x=Math.floor(v.x),y=Math.floor(v.y),z=Math.round(v.z),z>=mesh.voxelData.dimensions[2]&&(z=mesh.voxelData.dimensions[2]-1),voxel1=[x,y,z],voxel2=[x,y,z-1]),mesh.getVoxelAt(voxel1)?(pickResult.over=voxel2,pickResult.under=voxel1,pickResult):(pickResult.over=voxel1,pickResult.under=voxel2,pickResult)},window.CEWBS||(module.exports=CEWBS)},{"./helpers/util.js":2,"./meshers/greedy_tri.js":3}],2:[function(require,module){var util={};util.toHex=function(n){return n=parseInt(n,10),isNaN(n)?"00":(n=Math.max(0,Math.min(n,255)),"0123456789ABCDEF".charAt((n-n%16)/16)+"0123456789ABCDEF".charAt(n%16))},util.rgb2hex=function(rgba){return 3==rgba.length?util.toHex(rgb[0])+util.toHex(rgb[1])+util.toHex(rgb[2]):4==rgba.length?util.toHex(rgb[0])+util.toHex(rgb[1])+util.toHex(rgb[2])+util.toHex(rgb[3]):void 0},util.hex2rgb=function(hexStr){var R=parseInt(hexStr.substring(0,2),16),G=parseInt(hexStr.substring(2,4),16),B=parseInt(hexStr.substring(4,6),16);if(8==hexStr.length){var A=parseInt(hexStr.substring(6,8),16);return[R,G,B,A]}return[R,G,B]},module.exports=util},{}],3:[function(require,module,exports){var GreedyMesh=function(){var mask=new Int32Array(4096),meta=new Array(4096);return function(volume,dims,evaluateFunction,passID){function f(i,j,k){return volume[i+dims[0]*(j+dims[1]*k)]}for(var vertices=[],faces=[],normals=[],d=0;3>d;++d){var i,j,k,l,w,h,nm,u=(d+1)%3,v=(d+2)%3,x=[0,0,0],q=[0,0,0];for(mask.length<dims[u]*dims[v]&&(mask=new Int32Array(dims[u]*dims[v])),q[d]=1,x[d]=-1;x[d]<dims[d];){var n=0;for(x[v]=0;x[v]<dims[v];++x[v])for(x[u]=0;x[u]<dims[u];++x[u],++n){var metaA,metaB,a=0<=x[d]?f(x[0],x[1],x[2]):0,b=x[d]<dims[d]-1?f(x[0]+q[0],x[1]+q[1],x[2]+q[2]):0;Array.isArray(a)&&(metaA=a[1],a=a[0]),Array.isArray(b)&&(metaB=b[1],b=b[0]),evaluateFunction(a,metaA,passID)===evaluateFunction(b,metaB,passID)?(mask[n]=0,meta[n]=0):evaluateFunction(a,metaA,passID)?(mask[n]=a,meta[n]=metaA):(mask[n]=-b,meta[n]=metaB)}for(++x[d],n=0,j=0;j<dims[v];++j)for(i=0;i<dims[u];){var c=mask[n],metaC=meta[n];if(c){for(w=1;c===mask[n+w]&&i+w<dims[u];++w);var done=!1;for(h=1;j+h<dims[v];++h){for(k=0;w>k;++k)if(c!==mask[n+k+h*dims[u]]){done=!0;break}if(done)break}x[u]=i,x[v]=j;var du=[0,0,0],dv=[0,0,0];c>0?(dv[v]=h,du[u]=w):(c=-c,du[v]=h,dv[u]=w),nm=[0,0,0],nm[d]=c>0?1:-1;var vertex_count=vertices.length/3;for(vertices.push(x[0],x[1],x[2],x[0]+du[0],x[1]+du[1],x[2]+du[2],x[0]+du[0]+dv[0],x[1]+du[1]+dv[1],x[2]+du[2]+dv[2],x[0]+dv[0],x[1]+dv[1],x[2]+dv[2]),faces.push([vertex_count,vertex_count+1,vertex_count+2,c,metaC]),faces.push([vertex_count,vertex_count+2,vertex_count+3,c,metaC]),normals.push(nm[0],nm[1],nm[2],nm[0],nm[1],nm[2],nm[0],nm[1],nm[2],nm[0],nm[1],nm[2]),l=0;h>l;++l)for(k=0;w>k;++k)mask[n+k+l*dims[u]]=0;i+=w,n+=w}else++i,++n}}}return{vertices:vertices,faces:faces,normals:normals}}}();exports&&(exports.mesher=GreedyMesh)},{}]},{},[1]);