const BaseModel = require('../../core/model/BaseModel');

/**
 * User Model - fxd4 Framework
 * Meng-extend BaseModel untuk fungsionalitas CRUD otomatis.
 */
class User extends BaseModel {
    constructor() {
        // Mengarahkan ke tabel 'users' di Supabase
        super('users');
    }

    /**
     * Mencari user berdasarkan Email
     * Sekarang jauh lebih simpel menggunakan findBy dari BaseModel
     */
    async findByEmail(email) {
        return await this.findBy('email', email);
    }
    
    /**
     * Jika ingin menambahkan logic spesifik, misalnya user yang aktif saja:
     */
    async findActiveByEmail(email) {
        return await this.where('email', email)
                         .where('status', 'active')
                         .first();
    }
}

// Export sebagai instance agar bisa langsung dipanggil method-nya
module.exports = new User();