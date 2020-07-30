function injectForEachInsn(method, opcode, callback) {
    var ASM = Java.type('net.minecraftforge.coremod.api.ASMAPI');

    var target = ASM.findFirstInstruction(method,
        opcode);

    while (target !== null) {
        var index = method.instructions.indexOf(target);
        var indexShift = callback(target, index);

        var newIndex = method.instructions.indexOf(target);
        if (newIndex !== -1)
            index = newIndex;
        else if (typeof indexShift === 'number')
            index += indexShift;

        target = ASM.findFirstInstructionAfter(method,
            opcode,
            index + 1);
    }

    return method;
}

function initializeCoreMod() {
    return {
        'allow-sharpness': {
            'target': {
                'type': 'METHOD',
                'class': 'net.minecraft.enchantment.DamageEnchantment',
                'methodName': 'func_92089_a', // canApply
                'methodDesc': '(Lnet/minecraft/item/ItemStack;)Z'
            },
            'transformer': function (method) {
                var ASM = Java.type('net.minecraftforge.coremod.api.ASMAPI');
                var Opcodes = Java.type('org.objectweb.asm.Opcodes');
                var VarInsnNode = Java.type('org.objectweb.asm.tree.VarInsnNode');
                var InsnNode = Java.type('org.objectweb.asm.tree.InsnNode');
                var InsnList = Java.type('org.objectweb.asm.tree.InsnList');

                return injectForEachInsn(method, Opcodes.IRETURN, function (target) {
                    var newInstructions = new InsnList();

                    newInstructions.add(new VarInsnNode(Opcodes.ALOAD, 1));
                    newInstructions.add(ASM.buildMethodCall(
                        "vazkii/quark/base/handler/AsmHooks",
                        "canSharpnessApply",
                        "(Lnet/minecraft/item/ItemStack;)Z",
                        ASM.MethodType.STATIC
                    ));
                    newInstructions.add(new InsnNode(Opcodes.IOR));

                    method.instructions.insertBefore(target, newInstructions);
                });
            }
        },
        'allow-piercing': {
            'target': {
                'type': 'METHOD',
                'class': 'net.minecraft.enchantment.Enchantment',
                'methodName': 'func_92089_a', // canApply
                'methodDesc': '(Lnet/minecraft/item/ItemStack;)Z'
            },
            'transformer': function(method) {
                var ASM = Java.type('net.minecraftforge.coremod.api.ASMAPI');
                var Opcodes = Java.type('org.objectweb.asm.Opcodes');
                var InsnNode = Java.type('org.objectweb.asm.tree.InsnNode');
                var VarInsnNode = Java.type('org.objectweb.asm.tree.VarInsnNode');
                var InsnList = Java.type('org.objectweb.asm.tree.InsnList');

                return injectForEachInsn(method, Opcodes.IRETURN, function (target) {
                    var newInstructions = new InsnList();

                    newInstructions.add(new VarInsnNode(Opcodes.ALOAD, 0));
                    newInstructions.add(new VarInsnNode(Opcodes.ALOAD, 1));
                    newInstructions.add(ASM.buildMethodCall(
                        "vazkii/quark/base/handler/AsmHooks",
                        "canPiercingApply",
                        "(Lnet/minecraft/enchantment/Enchantment;Lnet/minecraft/item/ItemStack;)Z",
                        ASM.MethodType.STATIC
                    ));
                    newInstructions.add(new InsnNode(Opcodes.IOR));
                    method.instructions.insertBefore(target, newInstructions);
                })
            }
        },
        'piercing-no-efficiency': {
            'target': {
                'type': 'METHOD',
                'class': 'net.minecraft.enchantment.PiercingEnchantment',
                'methodName': 'func_77326_a', // canApplyTogether
                'methodDesc': '(Lnet/minecraft/enchantment/Enchantment;)Z'
            },
            'transformer': function(method) {
                var ASM = Java.type('net.minecraftforge.coremod.api.ASMAPI');
                var Opcodes = Java.type('org.objectweb.asm.Opcodes');
                var InsnNode = Java.type('org.objectweb.asm.tree.InsnNode');
                var VarInsnNode = Java.type('org.objectweb.asm.tree.VarInsnNode');
                var InsnList = Java.type('org.objectweb.asm.tree.InsnList');

                return injectForEachInsn(method, Opcodes.IRETURN, function (target) {
                    var newInstructions = new InsnList();

                    newInstructions.add(new VarInsnNode(Opcodes.ALOAD, 1));
                    newInstructions.add(ASM.buildMethodCall(
                        "vazkii/quark/base/handler/AsmHooks",
                        "isNotEfficiency",
                        "(Lnet/minecraft/enchantment/Enchantment;)Z",
                        ASM.MethodType.STATIC
                    ));
                    newInstructions.add(new InsnNode(Opcodes.IAND));
                    method.instructions.insertBefore(target, newInstructions);
                })
            }
        },
        'replace-damage-source': {
            'target': {
                'type': 'METHOD',
                'class': 'net.minecraft.util.DamageSource',
                'methodName': 'func_76365_a', // causePlayerDamage
                'methodDesc': '(Lnet/minecraft/entity/player/PlayerEntity;)Lnet/minecraft/util/DamageSource;'
            },
            'transformer': function (method) {
                var ASM = Java.type('net.minecraftforge.coremod.api.ASMAPI');
                var Opcodes = Java.type('org.objectweb.asm.Opcodes');
                var LabelNode = Java.type('org.objectweb.asm.tree.LabelNode');
                var JumpInsnNode = Java.type('org.objectweb.asm.tree.JumpInsnNode');
                var VarInsnNode = Java.type('org.objectweb.asm.tree.VarInsnNode');
                var InsnNode = Java.type('org.objectweb.asm.tree.InsnNode');
                var InsnList = Java.type('org.objectweb.asm.tree.InsnList');

                var newInstructions = new InsnList();

                var jump = new LabelNode();

                newInstructions.add(new VarInsnNode(Opcodes.ALOAD, 0));

                newInstructions.add(ASM.buildMethodCall(
                    "vazkii/quark/base/handler/AsmHooks",
                    "createPlayerDamage",
                    "(Lnet/minecraft/entity/player/PlayerEntity;)Lnet/minecraft/util/DamageSource;",
                    ASM.MethodType.STATIC
                ));
                newInstructions.add(new InsnNode(Opcodes.DUP));
                newInstructions.add(new JumpInsnNode(Opcodes.IFNULL, jump));
                newInstructions.add(new InsnNode(Opcodes.ARETURN));
                newInstructions.add(jump);
                newInstructions.add(new InsnNode(Opcodes.POP));

                method.instructions.insertBefore(method.instructions.getFirst(), newInstructions);

                return method;
            }
        }
    }
}
