// shared/api/act.js
import api from "./api";

// Функция трансформации данных команд для API
const transformTeamsForApi = (teams) => {
  if (!teams || !Array.isArray(teams)) return [];
  
  return teams.map(team => {
    const roles = [];
    
    // Герои
    if (team.heroes && team.heroes.length > 0) {
      const heroRole = {
        role: "hero",
        openVoting: team.isHeroRecruitmentOpen || false,
      };
      
      if (team.isHeroRecruitmentOpen) {
        heroRole.votingStartAt = `${team.heroVotingStartDate}T${team.heroVotingStartTime}:00`;
        heroRole.votingDurationHours = team.heroVotingHours || 24;
      } else {
        heroRole.candidateUserIds = team.heroes.map(hero => hero.id);
      }
      
      roles.push(heroRole);
    }
    
    // Навигаторы
    if (team.navigators && team.navigators.length > 0) {
      const navigatorRole = {
        role: "navigator",
        openVoting: team.isNavigatorRecruitmentOpen || false,
      };
      
      if (team.isNavigatorRecruitmentOpen) {
        navigatorRole.votingStartAt = `${team.navigatorVotingStartDate}T${team.navigatorVotingStartTime}:00`;
        navigatorRole.votingDurationHours = team.navigatorVotingHours || 24;
      } else {
        navigatorRole.candidateUserIds = team.navigators.map(nav => nav.id);
      }
      
      roles.push(navigatorRole);
    }
    
    // Спот-агенты
    if (team.agents && team.agents.length > 0) {
      roles.push({
        role: "spot_agent",
        openVoting: false,
        candidateUserIds: team.agents.map(agent => agent.id)
      });
    }
    
    // Задачи (пока пустые)
    const tasks = [];
    
    // Убедимся, что нет undefined полей
    const cleanRoles = roles.map(role => {
      const cleanRole = {};
      Object.keys(role).forEach(key => {
        if (role[key] !== undefined && role[key] !== null) {
          cleanRole[key] = role[key];
        }
      });
      return cleanRole;
    });
    
    return {
      name: team.name,
      roles: cleanRoles,
      tasks: tasks
    };
  });
};

export const actApi = {
  getAllActs: async () => {
    const response = await api.get("/act/get-acts");
    return response.data;
  },
  
  getAct: async (id) => {
    const response = await api.get(`/act/find-by-id/${id}`);
    return response.data;
  },
  
 createAct: async (name, desc, photoFile, teams = []) => {
  const formData = new FormData();
  
  formData.append('title', String(name || '')); 
  formData.append('description', String(desc || ''));
  formData.append('sequelId', '1');
  
  console.log('📸 Sending photo:', {
    name: photoFile?.name,
    type: photoFile?.type,
    size: photoFile?.size,
    instanceofFile: photoFile instanceof File
  });
  
  if (photoFile instanceof File) {
    formData.append('photo', photoFile);
    console.log('✅ Photo appended to FormData');
  } else {
    console.error('❌ photoFile is not a File instance:', photoFile);
  }

  const transformedTeams = transformTeamsForApi(teams);
  console.log('👥 Sending teams:', JSON.stringify(transformedTeams, null, 2));
  formData.append('teams', JSON.stringify(transformedTeams));
  
  // Логируем размер FormData
  let totalSize = 0;
  for (let pair of formData.entries()) {
    if (pair[0] === 'photo') {
      console.log(`  - ${pair[0]}: File(name: ${pair[1].name}, size: ${pair[1].size} bytes)`);
      totalSize += pair[1].size;
    } else {
      console.log(`  - ${pair[0]}: ${pair[1].substring(0, 100)}${pair[1].length > 100 ? '...' : ''}`);
      totalSize += new Blob([pair[1]]).size;
    }
  }
  console.log(`📦 Total FormData size: ~${(totalSize / 1024 / 1024).toFixed(2)} MB`);

  try {
    console.log('🚀 Sending request...');
    const response = await api.post("/act/create-act", formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total) {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          console.log(`📤 Upload progress: ${percentCompleted}%`);
        }
      }
    });
    
    console.log('✅ Server response received');
    console.log('Response status:', response.status);
    console.log('Response headers:', response.headers);
    console.log('Response data:', JSON.stringify(response.data, null, 2));
    
    // Проверяем наличие previewFileName
    if (response.data.previewFileName) {
      console.log('🖼️ previewFileName found:', response.data.previewFileName);
    } else {
      console.warn('⚠️ previewFileName is null or missing');
      
      // Проверяем другие возможные поля с изображением
      const possibleImageFields = ['preview', 'photo', 'image', 'cover', 'file', 'fileName', 'photoUrl', 'imageUrl', 'coverUrl'];
      possibleImageFields.forEach(field => {
        if (response.data[field]) {
          console.log(`✅ Found alternative image field "${field}":`, response.data[field]);
        }
      });
    }
    
    return response.data;
  } catch (error) {
    console.error('❌ API error:', error);
    if (error.response) {
      console.error('Error status:', error.response.status);
      console.error('Error data:', error.response.data);
      console.error('Error headers:', error.response.headers);
    } else if (error.request) {
      console.error('No response received:', error.request);
    } else {
      console.error('Error message:', error.message);
    }
    throw error;
  }
},


getRole: async (id, type) => {
    console.log("========== getRole CALLED ==========");
    console.log("📞 getRole received params:", { id, type });
    console.log("📞 id type:", typeof id, "value:", id);
    console.log("📞 type type:", typeof type, "value:", type);
    
    if (!id) {
      console.error("❌ getRole: id is missing!");
      return [];
    }
    
    if (!type) {
      console.error("❌ getRole: type is missing!");
      return [];
    }
    
    try {
      const url = `/act/${id}/candidates/${type}`;
      console.log("📡 Making request to:", url);
      
      const response = await api.get(url);
      
      console.log("✅ getRole response status:", response.status);
      console.log("✅ getRole response data:", response.data);
      console.log("===================================");
      
      return response.data;
    } catch (error) {
      console.error("❌ getRole error:", error);
      console.error("❌ error response:", error.response?.data);
      console.error("❌ error status:", error.response?.status);
      console.error("❌ error config:", error.config);
      console.log("===================================");
      
      // Возвращаем пустой массив вместо ошибки
      return [];
    }
  },
};